import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_reset_email(to_email: str, reset_link: str):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587
    sender_email = "your-email@gmail.com"
    sender_password = "your-app-password"

    message = MIMEMultipart("alternative")
    message["Subject"] = "Password Reset Instructions"
    message["From"] = sender_email
    message["To"] = to_email

    text = f"Please click the link below to reset your password:\n{reset_link}\nIf you did not request this, please ignore."
    html = f"""\
    <html>
      <body>
        <p>Please click the link below to reset your password:<br>
           <a href="{reset_link}">Reset Password</a>
        </p>
        <p>If you did not request this, please ignore this email.</p>
      </body>
    </html>
    """

    part1 = MIMEText(text, "plain")
    part2 = MIMEText(html, "html")
    message.attach(part1)
    message.attach(part2)

    with smtplib.SMTP(smtp_server, smtp_port) as server:
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, to_email, message.as_string())
