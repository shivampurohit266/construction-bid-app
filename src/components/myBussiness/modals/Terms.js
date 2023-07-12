import React from 'react';
import { withTranslation } from 'react-i18next';
const Terms = ({ t }) => {
  return (
    <div>
      <div
        className='modal fade'
        id='preview-terms'
        tabIndex='-1'
        role='dialog'
        aria-labelledby='previewModalLabel'
        aria-hidden='true'
      >
        <div className='modal-dialog modalPropu modal-dialog-centered'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button
                type='button'
                className='close'
                data-dismiss='modal'
                aria-label='Close'
              >
                <span aria-hidden='true'>&times;</span>
              </button>
            </div>
            <div className='modal-body'>
              <div className='pdf-section'>
                <div className='pdf-content'>
                  <div className='preview-report-to'></div>
                  <div className='preview-report-report'></div>{' '}
                </div>
                <div className='preview-report-project-info'>
                  {' '}
                  <div className='preview-report-title-task'>
                    <main>
                      <h2>{t('termServices.termheading')}</h2>
                      <p>{t('termServices.publishdate')}</p>

                      <p>{t('termServices.termDescription')}</p>

                      <ol>
                        <li>
                          <h3>{t('termServices.DefinitionsHeading')}</h3>
                          <p>{t('termServices.DefinitionsHeading-p1')}</p>
                          <p>{t('termServices.DefinitionsHeading-p2')}</p>
                          <p>{t('termServices.DefinitionsHeading-p3')}</p>
                          <p>{t('termServices.DefinitionsHeading-p4')}</p>
                          <p>{t('termServices.DefinitionsHeading-p5')}</p>
                          <p>{t('termServices.DefinitionsHeading-p6')}</p>
                          <p>{t('termServices.DefinitionsHeading-p7')}</p>
                          <p>{t('termServices.DefinitionsHeading-p8')}</p>
                          <p>{t('termServices.DefinitionsHeading-p9')}</p>
                          <p>{t('termServices.DefinitionsHeading-p10')}</p>
                          <p>{t('termServices.DefinitionsHeading-p11')}</p>
                          <p>{t('termServices.DefinitionsHeading-p12')}</p>
                          <p>{t('termServices.DefinitionsHeading-p13')}</p>
                          <p>{t('termServices.DefinitionsHeading-p14')}</p>
                          <p>{t('termServices.DefinitionsHeading-p15')}</p>
                        </li>
                        <li>
                          <h3>{t('termServices.DescriptionerviceHeading')}</h3>
                          <ol>
                            <li>
                              <p>
                                {t('termServices.DescriptionerviceHeading-p1')}
                              </p>
                            </li>
                            <li>
                              <p>
                                {t('termServices.DescriptionerviceHeading-p2')}
                              </p>
                            </li>
                            <li>
                              <p>
                                {t('termServices.DescriptionerviceHeading-p3')}
                              </p>
                            </li>
                            <li>
                              <p>
                                {t(
                                  'pages.termServices.DescriptionerviceHeading-p4'
                                )}
                              </p>
                            </li>
                            <li>
                              <p>
                                {t('termServices.DescriptionerviceHeading-p5')}
                              </p>
                              <p>
                                {t('termServices.DescriptionerviceHeading-p6')}
                              </p>
                              <p>
                                {t('termServices.DescriptionerviceHeading-p7')}
                              </p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.RightofrevocationHeading')}</h3>
                          <ol>
                            <li>
                              <p>
                                {t('termServices.RightofrevocationHeading-p1')}
                              </p>
                            </li>
                            <li>
                              <p>
                                {t('termServices.RightofrevocationHeading-p2')}
                              </p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.UserAccountsHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.UserAccountsHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.UserAccountsHeading-p2')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.UserAccountsHeading-p3')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.UserAccountsHeading-p4')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.PaymentsHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.PaymentsHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.PaymentsHeading-p2')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.IntellectualHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.IntellectualHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.IntellectualHeading-p2')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.IntellectualHeading-p3')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.AdditionalHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p2')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p3')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p4')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p5')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p6')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p7')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p8')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AdditionalHeading-p9')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.terminationHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.terminationHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.terminationHeading-p2')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.DefectsHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.DefectsHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.DefectsHeading-p2')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.DefectsHeading-p3')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.ApplicableHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.ApplicableHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.ApplicableHeading-p2')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.ApplicableHeading-p3')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.AmendmentsHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.AmendmentsHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AmendmentsHeading-p2')}</p>
                            </li>
                          </ol>
                        </li>
                        <li>
                          <h3>{t('termServices.AssignmentHeading')}</h3>
                          <ol>
                            <li>
                              <p>{t('termServices.AssignmentHeading-p1')}</p>
                            </li>
                            <li>
                              <p>{t('termServices.AssignmentHeading-p2')}</p>
                            </li>
                          </ol>
                        </li>
                      </ol>
                      <p>{t('termServices.update')}</p>
                    </main>
                  </div>
                </div>
                <br />
                <br />
                <br />
                <br />
                <br />
              </div>
              <div className='pdf-footer'>
                <p>{t('proposal_pdf.brand')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withTranslation()(Terms);
