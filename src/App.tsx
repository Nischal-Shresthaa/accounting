import { useState } from 'react';
import "./App.css";
import { CSVLink, CSVDownload } from "react-csv";



interface title {
  id: number;
  Account: string;
  debit: number;
  credit: number;
}




const accountOptions = [
  "Cash in Hand",
  "Accounts Receivable",
  "Prepaid Expenses",
  
];
  
export default function App() {
  const [entries, setEntries] = useState<title[]>([
    { id: 1, Account: "", debit: 0, credit: 0 },
  ]);
    const [note, setNote] = useState("");

  function updateRow(id: number, Accounthead: string, value: string | number) {
    const updated = entries.map((entry) => {
      if (entry.id === id) {
        return { ...entry, [Accounthead]: value };
      }
      return entry;
    });

    const lastRow = updated[updated.length -1];
    const hasData = lastRow.Account || lastRow.debit || lastRow.credit;
    if (lastRow.id=== id && hasData){
      updated.push( {id: lastRow.id + 1, Account: "", debit: 0, credit: 0});
    
    
    }
   setEntries(updated);
  }

  let totalDebit = 0;
  let totalCredit = 0;
  for (let i = 0; i < entries.length; i++) {
    totalDebit += entries[i].debit;
    totalCredit += entries[i].credit;
  }
 
  const isBalanced = totalDebit === totalCredit;

  const rows = entries.filter(entry => entry.Account || entry.debit || entry.credit);
  const csvBody = rows.map((entry, i) => [
  i + 1,
  entry.Account || "Account",
  entry.debit ? entry.debit.toFixed(2) : "0.00",
  entry.credit ? entry.credit.toFixed(2) : "0.00",
]);

  const csvData = [
    ["SN", "Account", "Debit", "Credit"],
    ...csvBody,
    [ "", "Total", totalDebit.toFixed(2), totalCredit.toFixed(2) ],
    [ "", isBalanced? "Status:Balanced": "Status:Unbalanced", "",""]
  ];
  

      return (
        <><div className="journal-entry">
          <h1>Journal Entry</h1>
          <div style={{ marginBottom: "20px", fontSize: "20px" }}>
            <strong>Date:</strong> {new Date().toLocaleDateString()}
          </div>
          <div style={{ marginBottom: "15px" }}></div>
          <strong>Note:</strong>
          <input type="text"
            placeholder=''
            value={note}
            onChange={(e) => setNote(e.target.value)} />
        </div><table border={3} className="journal-table">


 

            <thead>
              <tr>
                <th>SN</th>
                <th>Account Name</th>
                <th>Debit</th>
                <th>Credit</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="text"
                      placeholder="select account"
                      value={entry.accountTitle}
                      onChange={(e) => updateRow(entry.id, "accountTitle", e.target.value)}
                      list="accounts" />
                    <datalist id="accounts">
                      {accountOptions.map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </td>
                  <td>
                    <input
                      type="number"
                      value={entry.debit === 0 ? "" : entry.debit}
                      onChange={(e) => updateRow(entry.id, "debit", Number(e.target.value) || 0)}
                      disabled={entry.credit > 0} />
                  </td>

                  <td>
                    <input
                      type="number"
                      value={entry.credit === 0 ? "" : entry.credit}
                      onChange={(e) => updateRow(entry.id, "credit", Number(e.target.value) || 0)}
                      disabled={entry.debit > 0} />
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td></td>
                <td>Total</td>
                <td className={isBalanced ? "balanced" : "unbalanced"}>{totalDebit}</td>
                <td className={isBalanced ? "balanced" : "unbalanced"}>{totalCredit}</td>
              </tr>
            </tbody>
          </table>

          { <p className={isBalanced ? "balanced" : ":unbalanced"}>{isBalanced? ':Balanced' : 'Unbalanced'}</p> }

      

          <CSVLink
            data={csvData}
            filename={"journal_" + new Date().toISOString().slice(0, 10) + ".csv"}
                      className="noprint"
                      >
              Download
                    </CSVLink>
                 </>
           );
        }
