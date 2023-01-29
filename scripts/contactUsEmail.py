
# main method
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib
import sys

def sendEmail(name, email, message):

    print("sending email with message: " , message)
    
    emailPassword = "gswvctxlzhbrcdzg"

    me = "niyamabo@gmail.com"
    my_password = emailPassword
    you = "niyamabo@gmail.com"

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Spread the Word Contact Us"
    msg['From'] = me
    msg['To'] = you

    html = """\
        <html><body>
        <p>name:  """ + str(name) +  """</p>
        <p>email:  """ + str(email) +  """</p>
        <p>message:  """ + str(message) +  """</p>
        </body></html>
        """
    part2 = MIMEText(html, 'html')

    msg.attach(part2)

    # Send the message via gmail's regular server, over SSL - passwords are being sent, afterall
    s = smtplib.SMTP_SSL('smtp.gmail.com')
    # uncomment if interested in the actual smtp conversation
    # s.set_debuglevel(1)
    # do the smtp auth; sends ehlo if it hasn't been sent already
    s.login(me, my_password)

    s.sendmail(me, you, msg.as_string())
    s.quit()

def main(message, email, name):
    sendEmail(message, email, name)

#init 
if __name__ == "__main__":
    # take in the arguments
    name = sys.argv[1]
    email = sys.argv[2]
    message = sys.argv[3]
    main(name, email, message)
