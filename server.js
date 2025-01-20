const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'zaaaastava@gmail.com',
        pass: 'ufll gagf yaxo xuqq'
    }
});

app.post('/send-email', async (req, res) => {
    const { orderData } = req.body;
    
    // Format order items list
    const itemsList = orderData.items
        .map(item => `
            Proizvod: ${item.name}
            Količina: ${item.quantity}
            Cena po komadu: ${item.price} RSD
            Ukupno za stavku: ${item.price * item.quantity} RSD
            -------------------------`
        ).join('\n');

    // Email content for shop owner
    const ownerEmailContent = `
        Nova porudžbina!

        Informacije o kupcu:
        Ime: ${orderData.customer.name}
        Email: ${orderData.customer.email}
        Telefon: ${orderData.customer.phone}
        Adresa: ${orderData.customer.address}
        
        Poručeni proizvodi:
        ${itemsList}
        
        Ukupan iznos porudžbine: ${orderData.total} RSD

        Napomena: ${orderData.customer.note || 'Nema napomene'}
    `;

    // Email content for customer
    const customerEmailContent = `
        Poštovani/a ${orderData.customer.name},

        Hvala vam na porudžbini!

        Detalji vaše porudžbine:
        ${itemsList}
        
        Ukupan iznos: ${orderData.total} RSD

        Naš tim će vas kontaktirati u narednih 24 časa radi potvrde porudžbine i dogovora oko isporuke.

        Za sva dodatna pitanja možete nas kontaktirati na:
        Telefon: +381 11 123 4567
        Email: zaaaastava@gmail.com

        Srdačan pozdrav,
        Tim Domaća Rakija
    `;

    try {
        // Send to shop owner
        await transporter.sendMail({
            from: 'zaaaastava@gmail.com',
            to: 'zaaaastava@gmail.com',
            subject: `Nova porudžbina - ${orderData.customer.name}`,
            text: ownerEmailContent
        });

        // Send to customer
        await transporter.sendMail({
            from: 'zaaaastava@gmail.com',
            to: orderData.customer.email,
            subject: 'Potvrda vaše porudžbine - Domaća Rakija',
            text: customerEmailContent
        });
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
