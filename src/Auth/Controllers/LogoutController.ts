class LogoutController{
    static async logout(req:any, res:any) {
        try {
            return res.status(200).json({ 
                message: "Logged out successfully"
            });
        } catch (error) {
            console.error("Error during logout:", error);
            return res.status(500).json({ message: "Something went wrong, please try again!" });
        }
    }
}

export default LogoutController;