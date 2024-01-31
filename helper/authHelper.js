const bcrypt = require("bcrypt")


const hashPassword = async (password) => {
    try {
        const saltRount = 10;
        const hashedPassword = await bcrypt.hash(password, saltRount)
        return hashedPassword
    } catch (error) {
        console.log(error)
    }
}

const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword)
}

let serialNumberCounter = 1000001;

const generateSerialNumber = () => {
    const serialNumber = serialNumberCounter;
    serialNumberCounter++;
    return serialNumber;
}

const generateOTP = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const currentTime = new Date().toISOString();

    return {
        otp,
        currentTime
    };
};

module.exports = { hashPassword, comparePassword, generateSerialNumber, generateOTP }