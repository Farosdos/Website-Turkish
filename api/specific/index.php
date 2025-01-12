<?php
$jenkinsBaseUrl = "https://jenkins.mitask.ru.eu.org";
$jobApiUrl = "$jenkinsBaseUrl/job/Canvas/api/json";

$requestedVersion = isset($_GET['version']) ? $_GET['version'] : null;

if (!$requestedVersion) {
    http_response_code(400);
    header("Content-Type: application/json");
    echo json_encode(["error" => "Minecraft version not specified. Use the format /api/specific/<minecraft_version>."]);
    exit();
}

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
        $isExperimental = str_ends_with($displayName, "(Experimental)");
        $mcVersion = "Unknown";

        if (preg_match('/-([\d\.]+)( \(Experimental\))?$/', $displayName, $matches)) {
            $mcVersion = $matches[1];
        }

        if ($mcVersion === $requestedVersion) {
            $artifactUrl = null;
            if (isset($buildData['artifacts'][0])) {
                $artifact = $buildData['artifacts'][0];
                $artifactUrl = $buildUrl . "artifact/" . $artifact['relativePath'];
            }

            $filteredBuilds[] = [
                "number" => $buildNumber,
                "url" => $buildUrl,
                "download" => $artifactUrl,
                "mc_version" => $mcVersion,
                "experimental" => $isExperimental
            ];
        }
    }

    if (count($filteredBuilds) > 0) {
        header("Content-Type: application/json");
        echo json_encode(["builds" => $filteredBuilds]);
    } else {
        http_response_code(404);
        echo json_encode(["error" => "No builds found for Minecraft version $requestedVersion."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["error" => $e->getMessage()]);
}
