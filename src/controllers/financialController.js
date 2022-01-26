const xlsxPopulate = require('xlsx-populate');
const { getData, createOrUpdatedata } = require('../utils/functions');


module.exports = {
  async uploadXLSX(req, res) {
    const { id } = req.params;
    const xlsxBuffer = req.file.buffer;
    const xlsxCheck = req.file.originalname.slice(req.file.originalname.length-4)
    if(xlsxCheck !== "xlsx"){
      return res
          .status(400)
          .json({ Mensagem: "Não é um arquivo xlsx. Favor revisar." });
    }

    const xlsxData = await xlsxPopulate.fromDataAsync(xlsxBuffer);
    const rows = xlsxData.sheet(0).usedRange().value();
    const firstrow = rows[0];
    const filteredRows = rows.filter((_, index) => index !== 0);
    const keys = ["price", "typesOfExpenses", "date", "name"];
    firstrow.forEach((item, index) => {
      if (item !== keys[index] || firstrow.length !== 4) {
        return res
          .status(400)
          .json({ Mensagem: "Cabeçalho não está correto. Favor revisar." });
      }
    });

    let checkEmpty = false;
    for (let index = 0; index < filteredRows.length; index++) {
      checkEmpty = filteredRows[index].some((item) => item === undefined);
    }
    if (checkEmpty) {
      return res
        .status(400)
        .json({
          Mensagem:
            "Existem valores não preenchidos no arquivo xlsx. Favor revisar.",
        });
    }
    const users = getData("user.json");
    const existUser = users.filter((item) => item.id === Number(id));
    const [user] = existUser;
    if (!user) {
      return res
        .status(400)
        .send({ message: "Usuário não existe, informar id válido" });
    }
    const financialBase = getData("financial.json");
    const otherUserFinances = financialBase.filter(
      (item) => item.userId !== Number(id)
    );
    const existUserFinances = financialBase.filter(
      (item) => item.userId === Number(id)
    );
    const [userFinance] = existUserFinances;
    let newfinalcialData = [];
    if (!userFinance) {
      filteredRows.forEach((item, index) => {
        newfinalcialData = [
          ...newfinalcialData,
          {
            id: Number(1 + index),
            price: item[0],
            typesOfExpenses: item[1],
            date: item[2],
            name: item[3],
          },
        ];
      });

      const updatedUserFinances = [
        ...otherUserFinances,
        {
          id: 1000 + Number(id),
          userId: Number(id),
          financialData: [...newfinalcialData],
        },
      ];
      createOrUpdatedata(updatedUserFinances, "financial.json")
    } else {
      const existfinancialData = existUserFinances[0].financialData;
      filteredRows.forEach((item, index) => {
        newfinalcialData = [
          ...newfinalcialData,
          {
            id: Number(existfinancialData.length + 1 + index),
            price: item[0],
            typesOfExpenses: item[1],
            date: item[2],
            name: item[3],
          },
        ];
      });

      const updatedUserFinances = [
        ...otherUserFinances,
        {
          id: 1000 + Number(id),
          userId: Number(id),
          financialData: [...existfinancialData, ...newfinalcialData],
        },
      ];
      createOrUpdatedata(updatedUserFinances, "financial.json")
    }
    return res
      .status(201)
      .json({ Mensagem: "Finanças atualizadas com sucesso." });
  },
  async deleteOne(req, res) {
    const { userId, financialId } = req.params;
    
    const financial = getData("financial.json")
    const existUser = financial.filter((item) => item.userId === Number(userId));
    const otherUserFinances = financial.filter((item) => item.userId !== Number(userId));
    const [user] = existUser;
    if (!user){
      return res
        .status(400)
        .send({ message: "Usuário não existe, informar id válido" });
    }
    const existFinance = existUser[0].financialData.filter((item)=>item.id === Number(financialId))
    const otherFinances = existUser[0].financialData.filter((item)=>item.id !== Number(financialId))
    const [finance] = existFinance
    if (!finance){
      return res
        .status(400)
        .send({ message: "Despesa não existe, informar id válido" });
    }
    let updatedFinancialData = []

otherFinances.forEach((item, index)=>{
  updatedFinancialData = [
    ...updatedFinancialData,
    {
            id: Number(1 + index),
            price: item.price,
            typesOfExpenses: item.typesOfExpenses,
            date: item.date,
            name: item.name,
    }
  ]
})
        const updatedUserFinances = [
      ...otherUserFinances,
      {
        id: 1000 + Number(userId),
        userId: Number(userId),
        financialData: [...updatedFinancialData],
      },
  
    ];
    createOrUpdatedata(updatedUserFinances, "financial.json")

    return res
    .status(200)
    .json({ Mensagem: "Lançamento deletado com sucesso." });
  },
    async idexMonthYear (req, res){
      const { userId } = req.params;
      const { expensesType } = req.query; 
      const financial = getData("financial.json")
      const userfile = getData("user.json")
      const existuserfile = userfile.filter((item) => item.id === Number(userId));
      const [userfileArr] = existuserfile;
      const existUser = financial.filter((item) => item.userId === Number(userId));
      const [user] = existUser;
      
      if (!userfileArr){
        return res
          .status(400)
          .send({ message: "Usuário não existe, informar id válido" });
      } else if (!user && userfileArr) {
        return res
          .status(200)
          .send({ message: "Usuário existe, porém não possui despesas listadas" });
      }
      
      const financialData = existUser[0].financialData
      if (financialData.length === 0) {
        return res
          .status(200)
          .send({ message: "Usuário não possui despesas listadas"});
      }
      console.log(financialData.length)
      const MonthYearfinancialData = financialData.map((item)=>{
        return   {
          id: item.id,
          price: item.price,
          typesOfExpenses: item.typesOfExpenses,
          year: Number(item.date.substring(0,4)),
          month: Number(item.date.substring(5,7)),
          yearMonth:item.date.substring(0,4)+item.date.substring(5,7), 
          name: item.name
        }
      })
      let filteredMonthYearfinancialData = []
      if(expensesType){
        filteredMonthYearfinancialData = MonthYearfinancialData.filter((item)=>item.typesOfExpenses === expensesType)
      } else{
        filteredMonthYearfinancialData = MonthYearfinancialData
      }
     

      const listAllYear = filteredMonthYearfinancialData.map((item)=>{return item.year})
      const listYear = listAllYear.filter(function(ele, pos){
        return listAllYear.indexOf(ele) == pos;
      }).sort()

      let listYearMonthStr = []
        listYear.forEach((item)=>{
          for(i=0;i<12;i++){
            listYearMonthStr.push (item)
          }
        })
        
        //lista listYearMonthStr contem 12 aparições de cada ano (representando cada mes)
      let expensesPerYearMonth = listYearMonthStr.map((item)=>{
        return 0
      })
     

      filteredMonthYearfinancialData.forEach((item)=>{
          for (let index=0; index<listYear.length; index++){
            if(item.year === listYear[index] ){
              
              expensesPerYearMonth[index*12+item.month-1] = expensesPerYearMonth[index*12+item.month-1] + item.price
            }
          }
        })
       
        let expensesPerYearMonthObj =[]
        
        listYear.map((item, index)=>{
         return expensesPerYearMonthObj = [
            ...expensesPerYearMonthObj,
            {
                    year: item,
                    expenses: [
                    {Jan: expensesPerYearMonth[index*12]},
                     {Fev:expensesPerYearMonth[index*12+1]}, 
                     {Mar:expensesPerYearMonth[index*12+2]},
                     {Abr:expensesPerYearMonth[index*12+3]},
                     {Mai: expensesPerYearMonth[index*12+4]},
                     {Jun: expensesPerYearMonth[index*12+5]},
                     {Jul: expensesPerYearMonth[index*12+6]},
                     {Ago: expensesPerYearMonth[index*12+7]},
                     {Set: expensesPerYearMonth[index*12+8]},
                     {Out: expensesPerYearMonth[index*12+9]},
                     {Nov: expensesPerYearMonth[index*12+10]},
                     {Dez: expensesPerYearMonth[index*12+11]}]
            }]
          })
        

      return res
      .status(200)
      .json({ "Despesas por ano/mês": expensesPerYearMonthObj });
    }
  
};