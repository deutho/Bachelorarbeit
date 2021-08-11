import { formatDate } from "@angular/common";
import { Injectable } from "@angular/core";
import jsPDF from 'jspdf';
import { JsPDFFontService } from "./jsPDFFontService";

@Injectable({ providedIn: 'root' })
export class PDFService {

    constructor(private font: JsPDFFontService) {}
    

    generateHomeWorkVoucher(student: string) {
        var pdf = new jsPDF();

        this.font.AddFont(pdf);

        pdf.setFontSize(25);
        pdf.text("Hausübungsgutschein", 40, 35)

        pdf.setFontSize(16);
        pdf.text("Liebe " + student +"!", 5, 100);
        pdf.text("Wir bei derdieDAZ gratulieren dir herzlich zu deinen herausragenden Leistungen!", 5, 110)



        pdf.setFontSize(19)
        pdf.text("Dieser Gutschein berechtigt dich eine beliebige Hausübung auszulassen.", 5, 150);

        pdf.setFontSize(17)
        pdf.text("Ausgestellt am "+formatDate(new Date(), 'dd.MM.yyyy', 'en'),5, 180)
        pdf.text("Eingelöst am: ",5, 190)
        pdf.text("Unterschrift der Lehrkraft: ", 5, 200)



        pdf.setFontSize(15)
        pdf.text("(Nur gültig an deiner Schule und bei deiner derdieDAZ-Lehrkraft.)", 5, 290)


        var image1 = new Image()
        image1.src = "./../../../assets/Images/Logo-derdiedaz.png";
        pdf.addImage(image1, 'PNG', 130, 0, 80, 80);

        var image2 = new Image()
        image2.src = "./../../../assets/Images/logo.png";
        pdf.addImage(image2, 'PNG', 190,280,15,15)


        pdf.save('Gutschein '+student+' '+formatDate(new Date(), 'ddMMyyyy', 'en')+'.pdf');

    }
}