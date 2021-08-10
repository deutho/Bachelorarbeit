import { Injectable } from "@angular/core";
import jsPDF from 'jspdf';

@Injectable({ providedIn: 'root' })
export class PDFService {

    constructor() {}
    

    generateExamplePDF() {
        var pdf = new jsPDF();

        pdf.setFontSize(18)
        pdf.text("Hausübungsgutschein",10,30)

        pdf.save('Gutschein.pdf')

    }
}