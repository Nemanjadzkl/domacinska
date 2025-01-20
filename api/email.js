// api/email.js
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { orderData } = req.body;

    // Konfiguracija za Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER, // Koristite environment varijable
            pass: process.env.GMAIL_PASS, // Koristite environment varijable
        },
    });

    // Formatiranje detalja porudžbine
    const orderDetails = orderData.items
        .map(
            (item) => `
        Proizvod: ${item.name}
        Količina: ${item.quantity}
        Cena: ${item.price} RSD
        Ukupno: ${item.price * item.quantity} RSD
        ------------------------
    `
        )
        .join('\n');

    // Podaci o kupcu
    const customerInfo = `
        Ime i prezime: ${orderData.customer.name}
        Email: ${orderData.customer.email}
        Telefon: ${orderData.customer.phone}
        Adresa: ${orderData.customer.address}
        Napomena: ${orderData.customer.note || 'Nema napomene'}
    `;

    // Opcije za email
    const mailOptions = {
        from: process.env.GMAIL_USER, // Pošiljalac
        to: process.env.GMAIL_USER, // Primalac (možete promeniti na vaš email)
        subject: 'Nova porudžbina - Domaća Rakija',
        text: `
            NOVA PORUDŽBINA
            ================

            DETALJI PORUDŽBINE:
            ${orderDetails}

            UKUPAN IZNOS: ${orderData.total} RSD

            PODACI O KUPCU:
            ${customerInfo}
        `,
    };

    try {
        // Slanje emaila
        await transporter.sendMail(mailOptions);

        // Uspešan odgovor
        return res.status(200).json({
            success: true,
            message: 'Porudžbina je uspešno primljena i email je poslat.',
        });
    } catch (error) {
        console.error('Greška pri slanju emaila:', error);

        // Greška
        return res.status(500).json({
            success: false,
            message: 'Došlo je do greške prilikom slanja porudžbine.',
        });
    }
}