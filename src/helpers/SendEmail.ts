import sgMail from "@sendgrid/mail";
import handlebars from "handlebars";
import fs from "fs";
import path from "path";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type Options = {
  email: string;
  subject: string;
  message: any;
};

type EmailDetails = {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  items: any;
  total: number;
  dueDate: Date;
  invoiceDate: Date;
  notes: any;
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

const sendInvoiceEmail = (emailDetails: EmailDetails) => {
  console.log("send email");
  const invoiceTemplate = fs.readFileSync(
    path.join(__dirname, "invoice.hbs"),
    "utf-8"
  );
  const compiledInvoiceTemplate = handlebars.compile(invoiceTemplate);

  const {
    invoiceNumber,
    customerName,
    customerEmail,
    items,
    total,
    dueDate,
    invoiceDate,
    notes,
  } = emailDetails;

  console.log(items[0]);

  const mesg = {
    to: customerEmail,
    from: "msaadullah04@gmail.com",
    subject: `Xpress Car Rental - INVOICE # ${invoiceNumber}`,
    html: compiledInvoiceTemplate({
      invoiceNumber,
      customerName,
      invoiceDate,
      dueDate,
      items,
      total,
      notes,
    }),
  };

  console.log("sending email");
  sgMail
    .send(mesg)
    .then((res) => {
      console.log("Email sent\n", res);
    })
    .catch((err) => {
      console.error(err);
    });
};

export { sendMail, sendInvoiceEmail };
