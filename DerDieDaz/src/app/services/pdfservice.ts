import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import jsPDF from 'jspdf';
import { JsPDFFontService } from "./jsPDFFontService";

@Injectable({ providedIn: 'root' })
export class PDFService {

    constructor(private font: JsPDFFontService) {}
    

    generateHomeWorkVoucher(student: string, gender: string) {
        var pdf = new jsPDF("l",'mm', [297,210]);

        this.font.AddFont(pdf);

        var image0 = new Image()
        image0.src = "./../../../assets/Images/Gutschein.jpg";
        pdf.addImage(image0, 'JPG', 0, 0, 297, 210);

        pdf.setFontSize(24);

        let text = ""

        if(gender == "FEMALE") text = "Liebe " + student +"!";
        else if (gender == "MALE") text ="Lieber " + student +"!"
        else if (gender == "OTHER") text = "Liebe(r) " + student +"!"

        pdf.text(text, 148-text.length*3/2, 100)

        pdf.setFontSize(18)
        pdf.text(formatDate(new Date(), 'dd.MM.yyyy', 'en'), 158, 146)
       
        pdf.save('Gutschein '+student+' '+formatDate(new Date(), 'ddMMyyyy', 'en')+'.pdf');

    }
}