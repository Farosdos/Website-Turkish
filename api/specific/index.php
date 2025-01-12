<?php
$requestPath = trim($_SERVER['REQUEST_URI'], '/');
$basePath = 'api/specific';

if (!str_starts_with($requestPath, $basePath)) {
    http_response_code(404);
    header("Content-Type: application/json");
    echo json_encode(["error" => "Invalid endpoint. Use /api/specific/..."]);
    exit();
}

$argsPath = substr($requestPath, strlen($basePath));
$args = explode('/', trim($argsPath, '/'));

$mcVersion = null;
$isExperimental = null;

foreach ($args as $arg) {
    if (str_starts_with($arg, 'ver=')) {
        $mcVersion = substr($arg, 4);
    } elseif (str_starts_with($arg, 'experimental=')) {
        $isExperimental = filter_var(substr($arg, 13), FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    }
}

if ($mcVersion === null && $isExperimental === null) {
    http_response_code(400);
    header("Content-Type: application/json");
    echo json_encode(["error" => "No valid filters provided. Use ver=<mc_version> or experimental=<true/false>."]);
    exit();
}

$jenkinsBaseUrl = "https://jenkins.canvasmc.io";
$jobApiUrl = "$jenkinsBaseUrl/job/Canvas/api/json";

try {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $jobApiUrl);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FAILONERROR, true);

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        throw new Exception("Error fetching job data: " . curl_error($curl));
    }

    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($httpCode !== 200) {
        throw new Exception("Failed to fetch Jenkins data. HTTP Status Code: $httpCode");
    }

    $jobData = json_decode($response, true);

    if (!isset($jobData['builds']) || !is_array($jobData['builds'])) {
        http_response_code(404);
        echo json_encode(["error" => "No builds found."]);
        exit();
    }

    $filteredBuilds = [];
    foreach ($jobData['builds'] as $build) {
        $buildNumber = $build['number'];
        $buildUrl = $build['url'];
        $buildApiUrl = $buildUrl . "api/json";

        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $buildApiUrl);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_FAILONERROR, true);

        $buildResponse = curl_exec($curl);

        if (curl_errno($curl)) {
            throw new Exception("Error fetching build data: " . curl_error($curl));
        }

        $buildHttpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($buildHttpCode !== 200) {
            throw new Exception("Failed to fetch build data for build $buildNumber. HTTP Status Code: $buildHttpCode");
        }

        $buildData = json_decode($buildResponse, true);

        $displayName = $buildData['displayName'] ?? "Unknown";
        $isBuildExperimental = str_ends_with($displayName, "(Experimental)");
        $buildMcVersion = "Unknown";

        if (preg_match('/-([\d\.]+)( \(Experimental\))?$/', $displayName, $matches)) {
            $buildMcVersion = $matches[1];
        }

        $matchVersion = ($mcVersion === null || $buildMcVersion === $mcVersion);
        $matchExperimental = ($isExperimental === null || $isExperimental === $isBuildExperimental);

        if ($matchVersion && $matchExperimental) {
            $artifactUrl = null;
            if (isset($buildData['artifacts'][0])) {
                $artifact = $buildData['artifacts'][0];
                $artifactUrl = $buildUrl . "artifact/" . $artifact['relativePath'];
            }

            $filteredBuilds[] = [
                "number" => $buildNumber,
                "url" => $buildUrl,
                "download" => $artifactUrl,
                "mc_version" => $buildMcVersion,
                "experimental" => $isBuildExperimental
            ];
        }
    }

    header("Content-Type: application/json");
    echo json_encode(["builds" => $filteredBuilds]);
} catch (Exception $e) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["error" => $e->getMessage()]);
}
