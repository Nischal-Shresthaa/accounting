


import { useState } from 'react';
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface title {
  id: number;
  accountTitle: string;
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
 //   { id: 1, accountTitle: "", debit: 0, credit: 0 },
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
    const hasData = lastRow.accountTitle || lastRow.debit || lastRow.credit;
    if (lastRow.id=== id && hasData){
      updated.push( {id: lastRow.id + 1, accountTitle: "", debit: 0, credit: 0});
    
    
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


  function pdf() {
    const rows: title[] = [];
    for (const entry of entries) {
      if (entry.accountTitle || entry.debit || entry.credit) {
        rows.push(entry);
      }
    }
    return rows;
  }

  function downloadPdf() {
    const rows = pdf();
    if (!rows.length) {
      alert("File is empty");
      return;
    }

    const tableData = rows.map((entry, i) => [
      i + 1,
      entry.accountTitle || "Untitled",
      entry.debit ? entry.debit.toFixed(2) : "-",
      entry.credit ? entry.credit.toFixed(2) : "-",
    ]);

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Journal", 14, 15);
    doc.setFontSize(16);
    doc.text("Date: " + new Date().toLocaleDateString(), 14, 22);

    autoTable(doc, {
      startY: 28,
      head: [["SN", "Account Name", "Debit", "Credit"]],
      body: tableData,
      foot: [["", "Total", totalDebit.toFixed(2), totalCredit.toFixed(2)]],
      theme: "grid",
      footStyles: { fontStyle: "bold" },
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 30;
    doc.setFontSize(10);
    if (isBalanced) {
      doc.setTextColor(0, 0, 0);
      doc.text("Balanced", 14, finalY + 10);
    } else {
      doc.setTextColor(128, 128, 128);
      doc.text("Not balanced", 14, finalY + 10);
    }
    doc.save("journal_" + new Date().toISOString().slice(0, 10) + ".pdf");
  }

 console.log("hello")


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

          {isBalanced ? (
            <p className="balanced">Balanced</p>
          ) : (
            <p className="unbalanced">Unbalanced</p>
          )}

          <button onClick={downloadPdf} className="noprint">
            download
          </button>
        </>
      );
    }
