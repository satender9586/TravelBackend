const pool = require("../../Config/dbConnect")

const newTravelPlanning = async (req, res) => {
    let newUser = null;
    try {
        const { requesttype, traveltype, travelarea, bookedby, startdate, enddate, totaldays, travelpurpose, travelreson, baselocation, destlocation, advanceammount, desciption } = req.body;
        if (!requesttype || !traveltype || !travelarea || !bookedby || !startdate || !enddate || !totaldays || !travelpurpose || !travelreson || !baselocation || !destlocation || !advanceammount || !desciption) {
            res.status(400).json({
                success: false,
                message: "Every Field Is Mendatory Of Required"
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: "Ïnternal Server Error" })
    }
}

module.exports = { newTravelPlanning }