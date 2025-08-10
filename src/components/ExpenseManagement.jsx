import { useState, useEffect } from "react";
import classes from './ExpenseManagement.module.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const ExpenseManagement = () => {

    const [containerEditCash, setContainerEditCash] = useState("");

    const [expenses, setExpenses] = useState([]);

    const [cashEdit, setCashEdit] = useState("");
    const [cash, setCash] = useState("");
    const [expense, setExpense] = useState("");
    const [nameExpense, setNameExpense] = useState("");
    const [valueExpense, setValueExpense] = useState("");

    const handleNameExpense = (e) => setNameExpense(e.target.value);

    const handleValueExpense = (e) => {
        if (isNaN(e.target.value)) return;
        setValueExpense(e.target.value)
    }

    const handleCashEdit = (e) => {
        if (isNaN(e.target.value)) return;
        setCashEdit(e.target.value);
    }

    const handleExpenseRemove = (index) => {
        setExpenses((prevExpense) => prevExpense.filter((_, i) => i !== index))
    }

    const handleSetExpense = () => {
        let sum = 0;
        expenses.forEach((expense) => {

            let value = expense.Value
            .replace("R$", "")
            .trim()
            .replaceAll(".", "")
            .replace(",", ".")

            sum += Number(value);
        })

        const brl = sum.toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        });

        setExpense(brl);

    };

    useEffect(() => {
        window.addEventListener("keydown", (e) => {
            if (e.key === "Escape") setContainerEditCash("");
        })
    }, [])

    useEffect(() => {
        const brl = Number(cash).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        })
        setCash(brl);
    }, [])


    useEffect(() => {
        handleSetExpense();
    }, [expenses]);

    const handleReturnCash = (_return) => {

        let targetPrefix = false;

        if (cash.includes('-')) targetPrefix = true;

        let valueCash = Number(cash
            .replace("-", "")
            .replace("R$", "")
            .trim()
            .replaceAll(".", "")
            .replace(",", ".")
        )

        let valueReturn = Number(_return
            .replace("-", "")
            .replace("R$", "")
            .trim()
            .replaceAll(".", "")
            .replace(",", ".")
        )


        const math = eval(`
            ${targetPrefix ? '-' : ''}
            ${targetPrefix ? valueCash - Number(valueReturn) : valueCash + Number(valueReturn)}
        `)

        const valueBrl = Number(math).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        })

        if (math === 0) return setCash("R$ 0,00");

        setCash(valueBrl)

    };
 
    const handleExpenseCreate = (e) => {

        e.preventDefault();

        if (nameExpense.trim() === "") return;

        const min = 6;
        const max = 30;

        if (nameExpense.length < min || nameExpense.length > max) return alert(
            `Nome de despesa curto ou logo.`
        );


        if (valueExpense.trim().length > 12) return;

        const brl = Number(valueExpense).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        })

        const expenseObject = { Name: nameExpense, Value: brl };
        setExpenses([...expenses, expenseObject]);

 
        let targetPrefix = false;

        if (cash.includes('-')) targetPrefix = true;

        let value = Number(cash
            .replace("-", "")
            .replace("R$", "")
            .trim()
            .replaceAll(".", "")
            .replace(",", ".")
        )

        const math = eval(`
            ${targetPrefix ? '-' : ''}
            ${targetPrefix ? value + Number(valueExpense) : value - Number(valueExpense)}
        `)

        const valueBrl = Number(math).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        })

        setCash(valueBrl);
        setValueExpense("");
        setNameExpense("");
    }  

    const handleContainerEditCash = () => {
        setContainerEditCash("container_editCash_show")
    }

    const handleSetCashEdit = () => {

        if (cashEdit.trim().length > 12) return;

        const brl = Number(cashEdit).toLocaleString("pt-BR", {
            style: "currency", currency: "BRL"
        })
        setCash(brl);
        setExpenses([]);
        setExpense("");
        setContainerEditCash("");
    };

    return (
        <>
            <main className={classes.main_container_management}>
                <div className={classes.container_cash_and_expense}>
                    <div className={classes.container_cash}>

                        <span style={{ color: "#4bfa62ff", fontSize: "1rem" }}>{cash}</span>
                        <FontAwesomeIcon icon={faPen} className={classes.editCash} onClick= {handleContainerEditCash
                        } />

                        <div className={`${classes.container_edit_cash} ${containerEditCash && classes.container_editCash_show}`}>

                            <input type="text"
                            style={{fontSize: ".7rem"}}
                            placeholder="Digite um novo valor"
                            value={cashEdit}
                            onChange={handleCashEdit}/>

                            <input type="submit" value={"Editar"} onClick={handleSetCashEdit} />
                        </div>

                    </div>

                    <div className={classes.container_expense}>
                        <span style={{ color: "#ff1a1aff", fontSize: "1rem" }}>{expense}</span>
                    </div>

                </div>



                <form className={classes.form_container_expense} onSubmit={handleExpenseCreate}>
                    <input type="text" value={nameExpense} placeholder="Nome da despesa" onChange={handleNameExpense}/>
                    <input type="text" value={valueExpense} placeholder="Valor da despesa" onChange={handleValueExpense}/>
                    <input type="submit" value={"Adicionar"}/>
                </form>

                <div className={classes.container_expenses}>
                    {expenses.map((expense, i) => (
                    <div key={i} className={classes.box_expense}>

                        <span style={{
                            color: "#f8f8f8",
                            fontSize: ".67rem",
                            textTransform: "uppercase"
                        }}>{expense.Name}</span>

                        <div className={classes.box_container_info_and_remove}>

                            <span style={{
                                color: "#ff3b3bff", marginRight: "2.5rem", fontSize: ".75rem"
                            }}>{expense.Value}</span>

                            <FontAwesomeIcon icon={faTrash}
                            className={classes.expense_remove}
                            onClick={() => {
                                handleExpenseRemove(i),
                                handleReturnCash(expense.Value);
                            }}
                            />

                        </div>

                    </div>
                    ))}
                </div>

            </main>
        </>
    )

};

export default ExpenseManagement;