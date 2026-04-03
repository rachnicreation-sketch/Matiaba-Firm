<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Methode non autorisee"]);
    exit;
}

$to      = "rachnicreation@gmail.com";
$name    = htmlspecialchars(trim($_POST["name"] ?? ""));
$email   = htmlspecialchars(trim($_POST["email"] ?? ""));
$service = htmlspecialchars(trim($_POST["service"] ?? ""));
$subject = htmlspecialchars(trim($_POST["subject"] ?? ""));
$message = htmlspecialchars(trim($_POST["message"] ?? ""));

// Validation
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Champs obligatoires manquants"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Email invalide"]);
    exit;
}

$mail_subject = "=?UTF-8?B?" . base64_encode("[Matiaba Firm] $subject") . "?=";

$body  = "Nouveau message depuis le site Matiaba Firm\n";
$body .= "============================================\n\n";
$body .= "Nom       : $name\n";
$body .= "Email     : $email\n";
$body .= "Service   : $service\n";
$body .= "Objet     : $subject\n\n";
$body .= "Message   :\n$message\n\n";
$body .= "--------------------------------------------\n";
$body .= "Envoyé depuis : https://matiabafirm.com\n";
$body .= "Date          : " . date("d/m/Y H:i") . "\n";

$headers  = "From: =?UTF-8?B?" . base64_encode("Matiaba Firm") . "?= <noreply@matiabafirm.com>\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

$sent = mail($to, $mail_subject, $body, $headers);

if ($sent) {
    // Auto-reply to client
    $auto_subject = "=?UTF-8?B?" . base64_encode("Matiaba Firm — Confirmation de votre message") . "?=";
    $auto_body  = "Bonjour $name,\n\n";
    $auto_body .= "Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.\n\n";
    $auto_body .= "Récapitulatif de votre demande :\n";
    $auto_body .= "- Service : $service\n";
    $auto_body .= "- Objet   : $subject\n\n";
    $auto_body .= "Cordialement,\n";
    $auto_body .= "L'équipe Matiaba Firm\n\n";
    $auto_body .= "---\n";
    $auto_body .= "Matiaba Firm — Clean and Save\n";
    $auto_body .= "15 rue Kalli Fayette, Mpita wharf, Pointe-Noire\n";
    $auto_body .= "Tél : +242 04 006 5640 | contact@matiabafirm.com\n";
    $auto_headers  = "From: =?UTF-8?B?" . base64_encode("Matiaba Firm") . "?= <contact@matiabafirm.com>\r\n";
    $auto_headers .= "MIME-Version: 1.0\r\n";
    $auto_headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    mail($email, $auto_subject, $auto_body, $auto_headers);

    echo json_encode(["success" => true, "message" => "Message envoyé avec succès"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Erreur lors de l'envoi. Veuillez réessayer."]);
}
