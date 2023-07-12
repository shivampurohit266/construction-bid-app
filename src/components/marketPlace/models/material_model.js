import React, { Component } from 'react';
// import {  url } from "../../../helper/helper";
import { withTranslation } from 'react-i18next';
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
// import img from '../../../iman./../images/DefaultImg.png';

class material_model extends Component {
  render() {
    const { preview_array, t, tender_type } = this.props;
    const { show, handleClose } = this.props;
    console.log(tender_type);
    return (
      // <div
      //   className="modal fade"
      //   id="preview-info"
      //   tabIndex="-1"
      //   role="dialog"
      //   aria-labelledby="previewModalLabel"
      //   aria-hidden="true"
      // >
      <Modal
        isOpen={show}
        toggle={() => handleClose()}
        className={'modalPropu preview-modal'}
        centered
      >
        <ModalHeader toggle={() => handleClose()}>
          {tender_type === 'Request' || tender_type === ''
            ? t('b_sidebar.agreement.View_message')
            : t('b_sidebar.agreement.View_message1')}
        </ModalHeader>
        <ModalBody>
          <div className='pdf-section'>
            {/* view section start*/}

            <div className='col-md'>
              {/* <h5>
                  
                  </h5>
                {imgs}   
                    */}

              <div className='details-content'>
                <div className='head'>
                  <h4>
                    {' '}
                    {t(
                      'marketplace.material.create_material_list.request.input_title'
                    )}{' '}
                  </h4>
                  <p>{preview_array.title}</p>

                  <br />
                  <p>
                    {/* <h3> Main </h3> */}
                    <img
                      className='featured_image_css'
                      src={preview_array.featured_image}
                      alt=''
                    />
                    &nbsp;
                    {/* <h3> Attachment </h3> */}
                    {/* <img className="featured_image_css" src={preview_array.attachment} alt=""/> */}
                  </p>
                  {/* <h3> Product images </h3> */}
                  {/* {imgs}  */}
                  <br />
                  <h3>
                    {' '}
                    {t(
                      'marketplace.material.create_material_list.request.description'
                    )}{' '}
                  </h3>
                  <p> {preview_array.description} </p>
                </div>

                <table>
                  {preview_array?.warranty ? (
                    <tr>
                      <th>
                        {' '}
                        {t(
                          'marketplace.material.create_material_list.offer.warranty'
                        )}{' '}
                      </th>
                      <th> {preview_array?.warranty} </th>
                    </tr>
                  ) : (
                    ''
                  )}

                  {preview_array?.delivery_type ? (
                    <tr>
                      <th>
                        {' '}
                        {t(
                          'marketplace.material.create_material_list.offer.delivery_type'
                        )}{' '}
                      </th>
                      <th>
                        {' '}
                        {preview_array?.delivery_type === 'Included'
                          ? t(
                              'marketplace.material.create_material_list.offer.Included'
                            )
                          : t(
                              'marketplace.material.create_material_list.offer.Not_included'
                            )}{' '}
                      </th>
                    </tr>
                  ) : (
                    ''
                  )}
                  {preview_array?.cost_per_unit ? (
                    <tr>
                      <th>
                        {' '}
                        {t(
                          'marketplace.material.create_material_list.offer.cost_unit'
                        )}{' '}
                      </th>
                      <th> {preview_array?.cost_per_unit} </th>
                    </tr>
                  ) : (
                    ''
                  )}
                  {preview_array?.unit ? (
                    <tr>
                      <th>
                        {' '}
                        {t(
                          'marketplace.material.create_material_list.request.unit'
                        )}{' '}
                      </th>
                      <td>
                        {' '}
                        {preview_array.unit === 'Pcs'
                          ? t('marketplace.material.create_material_list.Pcs')
                          : preview_array.unit}{' '}
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {preview_array.state ? (
                    <tr>
                      <th>
                        {' '}
                        {t(
                          'marketplace.material.create_material_list.request.state'
                        )}{' '}
                      </th>
                      <td> {preview_array.state} </td>
                    </tr>
                  ) : (
                    ''
                  )}

                  {preview_array.categoryId ? (
                    <tr>
                      <th>
                        {' '}
                        {t(
                          'marketplace.material.create_material_list.request.category'
                        )}{' '}
                      </th>
                      <th> {preview_array.categoryId} </th>
                    </tr>
                  ) : (
                    ''
                  )}
                  {preview_array.quantity ? (
                    <tr>
                      <th>
                        {t(
                          'marketplace.material.create_material_list.request.vol_need'
                        )}
                      </th>
                      <td> {preview_array.quantity} </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {preview_array?.available_from ? (
                    <tr>
                      <th>
                        {' '}
                        {t('marketplace.work.create_work_list.work_start')}{' '}
                      </th>
                      <td> {preview_array.available_from} </td>
                    </tr>
                  ) : (
                    ''
                  )}
                  {preview_array?.available_to ? (
                    <tr>
                      <th>
                        {' '}
                        {t('marketplace.work.create_work_list.work_end')}{' '}
                      </th>
                      <td> {preview_array.available_to} </td>
                    </tr>
                  ) : (
                    ''
                  )}

                  {preview_array?.budget ? (
                    <tr>
                      <th> {t('marketplace.work.create_work_list.budget')} </th>
                      <td>
                        {' '}
                        {preview_array.budget === 'Hourly'
                          ? t(
                              'marketplace.material.create_material_list.request.Hourly'
                            )
                          : preview_array.budget === 'Fixed'
                          ? t(
                              'marketplace.material.create_material_list.request.Fixed'
                            )
                          : preview_array.budget === 'per_m2'
                          ? t(
                              'marketplace.material.create_material_list.request.cost/m2'
                            )
                          : ''}{' '}
                      </td>
                    </tr>
                  ) : (
                    ''
                  )}

                  {preview_array?.rate ? (
                    <tr>
                      <th> {t('marketplace.work.create_work_list.rate')} </th>
                      <td> {preview_array.rate} </td>
                    </tr>
                  ) : (
                    ''
                  )}
                </table>
              </div>
            </div>
          </div>
        </ModalBody>
      </Modal>
    );
  }
}

export default withTranslation()(material_model);
