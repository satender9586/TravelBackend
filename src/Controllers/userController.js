

// ---------------------Employee Registraion POST API ----------------------

const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // const user = await User.create({ username, email, password });
        res.json(username, email, password);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { signup };