<?php
// Check for empty fields
if(empty($_POST['name'])      ||
   empty($_POST['email'])     ||
   empty($_POST['phone'])     ||
   empty($_POST['message'])   ||
   !filter_var($_POST['email'],FILTER_VALIDATE_EMAIL))
   {
      echo "No arguments Provided!";
      return false;
   }

   echo (extension_loaded('openssl')?'SSL loaded':'SSL not loaded')."\n";

   use PHPMailer\PHPMailer\PHPMailer;
   use PHPMailer\PHPMailer\Exception;

   require '../vendor/php/phpmailer/src/Exception.php';
   require '../vendor/php/phpmailer/src/PHPMailer.php';
   require '../vendor/php/phpmailer/src/SMTP.php';
// Instantiation and passing `true` enables exceptions
   $mail = new PHPMailer();
   $mail->SMTPDebug = 1;


   $name = strip_tags(htmlspecialchars($_POST['name']));
   $email_address = strip_tags(htmlspecialchars($_POST['email']));
   $phone = strip_tags(htmlspecialchars($_POST['phone']));
   $message = strip_tags(htmlspecialchars($_POST['message']));


    //Server settings
   //  $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      // Enable verbose debug output
    $mail->isSMTP();                                            // Send using SMTP
    $mail->CharSet = 'UTF-8';
    $mail->Host       = 'tls://smtp.gmail.com:587';                    // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
    $mail->Username   = 'manuel.cdr@gmail.com';                     // SMTP username
    $mail->Password   = 'FarinhaDeBanana5453';                               // SMTP password
    $mail->SMTPSecure = "tls";         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` also accepted
    $mail->Port       = 587;                                    // TCP port to connect to

    //Recipients
    $mail->setFrom('manuel.cdr@gmail.com', 'Mailer');
    $mail->addAddress('manuel.cdr@gmail.com', 'Joe User');     // Add a recipient
   //  $mail->addAddress('ellen@example.com');               // Name is optional
   //  $mail->addReplyTo('info@example.com', 'Information');
   //  $mail->addCC('cc@example.com');
    $mail->addBCC($email_address);

    // Attachments
   //  $mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
   //  $mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name

    // Content
    $mail->isHTML(true);                                  // Set email format to HTML
    $mail->Subject = 'Contato via Site - ' . $name;
    $mail->Body    = 'This is the HTML message body <b>in bold!</b>';
    $mail->AltBody = 'This is the body in plain text for non-HTML mail clients';

    if (!$mail->send()) {
      echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    } else {
      echo 'Message has been sent';
    }
    
   

   
// // Create the email and send the message
// $to = 'manuel.cdr@gmail.com'; // Add your email address inbetween the '' replacing yourname@yourdomain.com - This is where the form will send a message to.
// $email_subject = "Website Contact Form:  $name";
// $email_body = "You have received a new message from your website contact form.\n\n"."Here are the details:\n\nName: $name\n\nEmail: $email_address\n\nPhone: $phone\n\nMessage:\n$message";
// $headers = "From: manuel.cdr@gmail.com\n"; // This is the email address the generated message will be from. We recommend using something like noreply@yourdomain.com.
// $headers .= "Reply-To: $email_address";   
// $success = mail($to,$email_subject,$email_body,$headers);
// if (!$success) {
//    print_r(error_get_last());
// }
// return true;         
?>