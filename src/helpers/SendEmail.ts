import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type Options = {
  email: string;
  subject: string;
  message: any;
};

const sendMail = async (options: Options) => {
  const message = {
    to: options.email,
    from: "msaadullah04@gmail.com",
    subject: options.subject,
    html: `<h4>${options.message}</h4>`,
  };

  await sgMail.send(message);
};

export default sendMail;
