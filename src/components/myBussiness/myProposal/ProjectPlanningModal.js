import React, { useState } from 'react'
import { withTranslation } from 'react-i18next'
import './ProjectPlanningModal.css'

const ProjectPlanningModal = (props) => {
  const t = props.t
  const [itemName, setItemName] = useState(props.mobileItemName.items)
  const [quantity, setQuantity] = useState(props.mobileItemName.dur)
  const [itemPrice, setItemPrice] = useState(props.mobileItemName.cost)
  const [unit, setUnit] = useState(props.mobileItemName.unit?props.mobileItemName.unit:"")
  const [idx, setIdx] = useState(props.mobileItemName.idx)
  const data = {
    idx: idx,
    forWhat: props.forWhat,
    itemName: itemName,
    quantity: quantity,
    itemPrice: itemPrice,
    unit: unit
  }
  console.log(data, "???????");
  return (
    <div id="wrapper">
      <div className="project-planning-modal">
        <div className="flex">
          <h3>{t("myBusiness.template.addItemDetails")}</h3>
          <button type="button" className="close" onClick={()=>props.handleClose()}><span aria-hidden="true">×</span></button>
        </div>
          <input type="text" placeholder={`${" "}${t("myBusiness.template.itemName")}`} value={itemName} onChange={(e) => setItemName(e.target.value)}></input>
          <div className="grid-form">
            <div>
              <label htmlFor="qty">{t("myBusiness.template.quantity")}</label>
              <input name="qty" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>

            <div>
              <label htmlFor="unit">{t("myBusiness.template.unit")}</label>
              <select value={unit} name="unit" id="unti" placeholder="Select" onChange={(e) => setUnit(e.target.value)}>
                <option value="">{t("myBusiness.template.select")}</option>
                <option value="Hrs">{t("myBusiness.template.HRS")}</option>
                <option value="Lts">{t("myBusiness.template.LTS")}</option>
                <option value="Pcs">{t("myBusiness.template.PCS")}</option>
                <option value="Kg">{t("myBusiness.template.KG")}</option>
              </select>
            </div>

            <div>
              <label htmlFor="price">{t("myBusiness.template.pricePerItem")}</label>
              <input name="price" type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} />
            </div>
          </div>

          <div>
            <label htmlFor="totalamount">{t("myBusiness.template.totalPrice")}</label>
            <input id="total-amount" type="number" placeholder="xxxxxxx" value={itemPrice * quantity} />
          </div>

          <button onClick={() => props.handleSelectMobile(data)} className="btn btn-primary">{t("myBusiness.template.save")}</button>
      </div>
    </div>

  )
}

export default withTranslation()(ProjectPlanningModal);