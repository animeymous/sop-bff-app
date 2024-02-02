import { Injectable } from '@nestjs/common';
import { PDFDocument, rgb} from "pdf-lib";
import { writeFile } from 'fs/promises';
import * as nodemailer from "nodemailer";
import { env } from "process"

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async sendEmailToUser (body){
    // create new pdf
    const pdfDoc = await PDFDocument.create();

    // add a new blank page
    const page = pdfDoc.addPage();

    // get the height and width of the page
    const { width, height } = page.getSize();

    // draw a string top of the page
    const fontSize = 20;
    page.drawText('Customized SOP Generator', {
      x: 160,
      y: height - 4 * fontSize,
      size: fontSize,
      color: rgb(0,0,0),
    })

    page.drawText(`Hi ${body[1]?.value}`, {
      x: 50,
      y: height - 6 * fontSize,
      size: fontSize - 10,
      color: rgb(0,0,0),
    })

    page.drawText(`Thanks for using our free SOP drafting service! Your SOP is attached below`, {
      x: 50,
      y: height - 7 * fontSize,
      size: fontSize - 10,
      color: rgb(0,0,0),
      maxWidth: 500,
      wordBreaks: [' ']
    })

    let lineCount = 8;

    for(let i = 0; i < body.length; i++){
      ++lineCount;

      page.drawText(`${body[i]?.key}`, {
        x: 50,
        y: height - lineCount * fontSize,
        size: fontSize - 10,
        color: rgb(0,0,0),
      })

      ++lineCount;

      page.drawText(`${body[i]?.value}`, {
        x: 50,
        y: height - lineCount * fontSize,
        size: fontSize - 10,
        color: rgb(0,0,0),
      })
    }

    // Serialize the PDFDocument to bytes (a Uint8Array)
    const pdfBytes = await pdfDoc.save()

    // if you want to save locally then please give path and file name in below commented code
    // await writeFile('./newpdf.pdf', pdfBytes);

    let transporter = nodemailer.createTransport({
      service: 'gmail', // am using gmail
      auth: {
          // users email
          user: process.env.user_email || "your@email",
          // users APP PASSWORD (you need to create APP PASSWORD by going in your gmail account)
          pass: process.env.user_email_password || "your@password"
      }
    })

    let mailOptions = {
      from: process.env.user_email || "your@email", // sender's mail
      to: process.env.receiptant_email || body?.[0]?.value, // receiver's mail
      subject: "SOP", // subject of email
      text: `Hi ${body?.[1]?.value},
      \n\nThe information you filled in the SOP form now can see in the pdf
      \nPdf attached below, Kindly check it.\n \nFeel free to contact us!
      \n \n226-774-9168
      \ninfo@effizient.ca
      \nwww.effizieint.c
      \n\nWe will get you going with your visa application in no time. This will all be remote, whichmeans you won’t have any hassle at all!
      \n\n\nBest Regards,
      \nTeam Effizien`, // data of email
      attachments: [
        {
          filename: 'sop.pdf',
          content: pdfBytes,
        },
      ],
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if(error){
          return error;
      }else{
        return "email sent: " + info.response
      }
    })
  }
}
