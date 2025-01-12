<?php
$jenkinsApiUrl = "https://jenkins.mitask.ru.eu.org/job/Canvas/api/json";

try {
    $curl = curl_init();
    curl_setopt($curl, CURLOPT_URL, $jenkinsApiUrl);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($curl, CURLOPT_FAILONERROR, true);

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        throw new Exception("Error fetching data: " . curl_error($curl));
    }

    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);

    if ($httpCode !== 200) {
        throw new Exception("Failed to fetch Jenkins data. HTTP Status Code: $httpCode");
    }

    $data = json_decode($response, true);

    if (isset($data['builds']) && is_array($data['builds'])) {
        $builds = array_map(function ($build) {
            return [
                "number" => $build['number'],
                "url" => $build['url']
            ];
        }, $data['builds']);

        header("Content-Type: application/json");
        echo json_encode([
            "builds" => $builds
        ]);
    } else {
        http_response_code(404);
        echo json_encode([
            "error" => "No builds found."
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
