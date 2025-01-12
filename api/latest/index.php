<?php
$jenkinsApiUrl = "https://jenkins.mitask.ru.eu.org/job/Canvas/lastBuild/api/json";

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

    if (isset($data['artifacts'][0])) {
        $artifact = $data['artifacts'][0];
        $artifactUrl = $data['url'] . "artifact/" . $artifact['relativePath'];

        header("Location: $artifactUrl");
        exit();
    } else {
        http_response_code(404);
        echo json_encode([
            "error" => "No artifacts found in the latest build."
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "error" => $e->getMessage()
    ]);
}
