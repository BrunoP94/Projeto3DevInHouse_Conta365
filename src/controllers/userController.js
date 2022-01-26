const { getData, createOrUpdatedata } = require("../utils/functions");

module.exports = {
  async create(req, res) {
    const { name, email } = req.body;
    const users = getData("user.json");
    const existKeyValue = Object.keys(req.body).filter(
      (item) => !req.body[item]
    );
    
    if (existKeyValue.length > 0) {
      return res.status(400).json({
        Mensagem:
          "Favor enviar os campos name e email devidamente preenchidos",
      });
    } else {
      if (typeof name === "string" && typeof email === "string") {
        const createNewUser = [
          ...users,
          {
            id: users.length + 1,
            name: name,
            email: email,
          },
        ];
        createOrUpdatedata(createNewUser, "user.json");
        return res.status(201).json({ Mensagem: "Usuário criado com sucesso" });
      } else {
        return res.status(400).json({
          Mensagem: "Os campos name e email devem ser preenchidos, e devem ser do tipo 'string'",
        });
      }
    }
  },

  async updateOne(req, res) {
    const { id } = req.params;
    const { name, email } = req.body;
    console.log(req.body)
    const existKeyValue = Object.keys(req.body).filter(
      (item) => !req.body[item]
    );
    const users = getData("user.json");
    const existUser = users.filter((item) => item.id === Number(id));
    const otherUser = users.filter((item) => item.id !== Number(id));
    const [user] = existUser;
    
    if (!user) {
      return res
        .status(400)
        .send({ message: "Usuário não existe, informar id válido" });
    } else if (existKeyValue.length > 0 || !name || !email || typeof(name) !== "string" || typeof(email) !== "string") {
      return res.status(400).json({
        Mensagem:
          "Favor enviar os campos name e email devidamente preenchidos",
      });
    } else {
      const updatedUser = [
        ...otherUser,
        {
          id: Number(id),
          name: name,
          email: email,
        },
      ];

      createOrUpdatedata(updatedUser, "user.json");
      return res
        .status(200)
        .json({ Mensagem: "Usuário atualizado com sucesso" });
    }
  },
  async indexOne(req, res) {
    const { id } = req.params;
    const users = getData("user.json");
    const existUser = users.filter((item) => item.id === Number(id));
    const [user] = existUser;
    if (!user) {
      return res
        .status(400)
        .json({ Mensagem: "Usuário não existe, informar id válido" });
    } else {
        
      return res.status(200).json({ user: user });
    }
  },
};
