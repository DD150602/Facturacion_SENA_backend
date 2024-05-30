import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'samivazqueles@gmail.com',
    pass: 'vufa ukab ofkg sivb'
  }
})

export default transporter
