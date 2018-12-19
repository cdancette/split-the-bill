import React, { Component } from 'react';
import './App.css';


class App extends Component {
  render() {
    return (
      <div>
        <FormContainer />
      </div>

    );
  }
}

export default App;

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      total: null,
      taxesAndTips: null,
      persons: [{ name: null, amountEntered: null, }],

    }

    this.updateName = this.updateName.bind(this);
    this.updateAmount = this.updateAmount.bind(this);
    this.updateTaxes = this.updateTaxes.bind(this);
    this.updateTotal = this.updateTotal.bind(this);
    //this.computeTotal = this.computeTotal.bind(this);
  }


  computeTotal() {
    const persons = this.state.persons.slice();
    const sumAmountPersons = persons.map(p => p.amountEntered).reduce((a, b) => a+b);
    let totalHT;
    if (this.state.total) {
      totalHT = this.state.total;
    }
    else {
      totalHT = sumAmountPersons;
    }

    const taxes = this.state.taxesAndTips || 0;

    let remainingEachPeople = 0;
    if (this.state.total) {
      const remaining = this.state.total - sumAmountPersons;
      remainingEachPeople = remaining / persons.length;
    }
    persons.map(p => {
      p.amountDueHT = p.amountEntered + remainingEachPeople;
    });
    

    persons.map(p => {
      p.ratio = p.amountDueHT / totalHT;
    })

    persons.map(p => {
      p.amountDueTTC = p.amountDueHT + p.ratio * taxes
    })

    this.setState({persons: persons})
    
  }

  updateTotal(newTotal) {
    this.setState({ total: parseFloat(newTotal) || null });
  }

  updateTaxes(newTaxes) {
    this.setState({ taxesAndTips: parseFloat(newTaxes) || null });
  }

  addPerson() {
    console.log(this);
    const persons = this.state.persons.concat([{ name: null, amountEntered: null }]);
    console.log("adding new person");
    this.setState({ persons: persons });
  }

  updateName(id, name) {
    const persons = this.state.persons.slice();
    persons[id].name = name;
    this.setState({ persons: persons });
  }

  updateAmount(id, amountEntered) {
    const persons = this.state.persons.slice();
    persons[id].amountEntered = parseFloat(amountEntered) || 0 ;
    this.setState({ persons: persons });
  }

  personField(id, person) {
    return (
        <div key={id} className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Person {id + 1}</label>
          </div>
          <div className="field-body">
            <div className="field">
              <p className="control is-expanded has-icons-left">
                <input className="input" type="text" placeholder="Name"
                  defaultValue={person.name}
                  name={"person_" + id} onChange={event => this.updateName(id, event.target.value)} />
                <span className="icon is-small is-left">
                  <i className="fas fa-user"></i>
                </span>
              </p>
            </div>
            <div className="field">
              <p className="control is-expanded has-icons-left has-icons-right">
                <input className="input" placeholder="Amount (empty = auto)" defaultValue={person.amountEntered} name={"person_" + id + "_amount"}
                  onChange={event => this.updateAmount(id, event.target.value)} />
                <span className="icon is-small is-left">
                  <i className="fas fa-dollar-sign"></i>
                </span>
              </p>
            </div>
            <div className="field"><input className="input" disabled defaultValue={person.amountDueTTC}/></div>
          </div>
        </div>
    );
  }

  render() {

    const persons = this.state.persons.map(
      (p, index) => this.personField(index, p)
    );

    return (
      <form>
        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Total amount HT</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input className="input" placeholder="Total amount HT (leave empty for auto)"
                  name="total_ht"
                  onChange={event => this.updateTotal(event.target.value)}
                />
              </div>

            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Taxes & tip</label>
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <input className="input" type="text" placeholder="Total taxes" name="taxes"
                  onChange={event => this.updateTaxes(event.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {persons}

        <div className="field is-horizontal">
          <div className="field-label">
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <a className="button is-primary" onClick={() => this.addPerson()}>
                  Add a person
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="field is-horizontal">
          <div className="field-label">
          </div>
          <div className="field-body">
            <div className="field">
              <div className="control">
                <a className="button is-primary" onClick={() => this.computeTotal()}>
                  Submit
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}
