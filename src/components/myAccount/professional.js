import React, { useState, useEffect, useRef } from 'react';
import './professional.css';
import { Multiselect } from 'multiselect-react-dropdown';
import axios from 'axios';
import { url } from '../../helper/helper';
import { withTranslation } from 'react-i18next';
import { getData, postDataWithToken } from '../../helper/api';

const Professional = ({
  t,
  visibility,
  allAccountData,
  allSkills,
  addressCity,
}) => {
  console.log(allAccountData, '?>?>?>');
  const [companyName, setCompanyName] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [tax, setTax] = useState('');
  const [business, setBusiness] = useState('');
  const [construction, setConstruction] = useState([]);
  const [constructionList, setConstructionList] = useState('');
  const [savedConstruction, setSavedConstruction] = useState([]);
  const [availability, setAvailability] = useState('');
  const [Introduction, setIntroduction] = useState('');
  const [states, setStates] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [city, setCity] = useState([]);
  const [savedCities, setSavedCities] = useState([]);
  const [citiesList, setCitiesList] = useState('');
  const [skills, setSkills] = useState([]);
  const [skillsList, setSkillsList] = useState('');
  const [savedSkills, setSavedSkills] = useState([]);
  const [visibilityValue, setVisibilityValue] = useState('');
  const [succes, setSucces] = useState(false);

  const [errors, setErrors] = useState({
    intro_error: '',
    company_error: '',
  });

  const { intro_error, company_error } = errors;

  const token = localStorage.getItem('token');
  const lng = localStorage.getItem('_lng');

  useEffect(() => {
    account();
  }, [allAccountData]);

  // useEffect(() => {
  //   allskills();
  // }, [allSkills]);
  useEffect(() => {
    getState();
    getSkills();
    // getProfile();
  }, [lng]);

  useEffect(() => {
    visibility(visibilityValue);
  }, [visibilityValue]);

  useEffect(() => {
    getCities();
  }, [selectedState]);
  // useEffect(() => {
  //   cities();
  // }, [addressCity]);

  const getCities = async () => {
    const allRegions = parseInt(selectedState) === 957 ? [] : selectedState;
    if (allRegions) {
      await getData(`${url}/api/cityId/${allRegions}/${lng}`, token)
        .then((result) => {
          setCity(result?.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  // const allskills = () => {
  //   const all = allSkills;
  //   if (all) {
  //     const mapSkills = all.map((skill) => skill.id);
  //     setSkillsList(mapSkills);
  //   }
  // };

  const account = () => {
    const accountData = allAccountData;
    if (accountData.company_type === null) {
      setCompanyType(1);
    } else setCompanyType(accountData.company_type);

    if (accountData.business_insurance === null) {
      setBusiness(0);
    } else setBusiness(accountData.business_insurance);
    if (accountData.tax_registration === null) {
      setTax(0);
    } else setTax(accountData.tax_registration);
    setCompanyName(accountData.company_name);
    setIntroduction(accountData.introduction ? accountData.introduction : '');
    if (accountData.availability === null) {
      setAvailability(0);
    } else setAvailability(accountData.availability);
    var b = accountData.licenses?.split(',').map(function (item) {
      return parseInt(item, 6);
    });
    console.log(b, '????bbbbb');
    setConstruction(accountData.licenses_arr);
    const mapLicenses = accountData.licenses_arr?.map((license) => license.id);
    setConstructionList(mapLicenses);
    if (b?.length) {
      const commonElements = accountData.licenses_arr?.filter((license) => {
        return b.includes(license.id);
      });
      setSavedConstruction(commonElements);
    }

    setSavedSkills(accountData.skills_arr);
    //   const mapSkills = accountData.skills_arr.map((skill) => skill.id);
    //  setSkillsList(mapSkills);
    // setSavedCities(accountData.city_arr);
    // const mapCities = accountData.city_arr.map((city) => city.id);
    // setCitiesList(mapCities);
    setSelectedState(accountData.work_location_state);

    setVisibilityValue(accountData.visibility);
  };
  // const getProfile = async () => {
  //   await getData(`${url}/api/profile`, token)
  //     .then((res) => {
  //       const details = res.data[0];

  //       if (details.company_type === null) {
  //         setCompanyType(1);
  //       } else setCompanyType(details.company_type);

  //       if (details.business_insurance === null) {
  //         setBusiness(0);
  //       } else setBusiness(details.business_insurance);
  //       if (details.tax_registration === null) {
  //         setTax(0);
  //       } else setTax(details.tax_registration);
  //       setCompanyName(details.company_name);
  //       setIntroduction(details.introduction ? details.introduction : "");
  //       if (details.availability === null) {
  //         setAvailability(0);
  //       } else setAvailability(details.availability);
  //       var b = details.licenses?.split(",").map(function (item) {
  //         return parseInt(item, 6);
  //       });
  //       setConstruction(details.licenses_arr);
  //       const mapLicenses = details.licenses_arr?.map((license) => license.id);
  //       setConstructionList(mapLicenses);
  //       const commonElements = details.licenses_arr?.filter((license) => {
  //         return b.includes(license.id);
  //       });

  //       setSavedConstruction(commonElements);
  //       setSavedSkills(details.skills_arr);
  //       const mapSkills = details.skills_arr.map((skill) => skill.id);
  //       setSkillsList(mapSkills);
  //       setSavedCities(details.city_arr);
  //       const mapCities = details.city_arr.map((city) => city.id);
  //       setCitiesList(mapCities);
  //       setSelectedState(details.work_location_state);

  //       setVisibilityValue(details.visibility);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };

  // const getLicenses = () => {
  //   axios
  //     .get(`${url}/api/licenses/${lng}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res);
  //       setConstruction(res.data.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // };
  const getSkills = async () => {
    await getData(`${url}/api/skills/${lng}`, token)
      .then((res) => {
        console.log(res);
        setSkills(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getState = async () => {
    await getData(`${url}/api/state/${lng}`, token)
      .then((res) => {
        setStates(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    let newErrors = { ...errors };

    if (Introduction.length < 50) {
      hasErrors = true;
      newErrors.intro_error =
        'Introduction must be at least 50 characters long';
    }

    if (!companyName) {
      hasErrors = true;
      newErrors.company_error = 'Please add a company name';
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    } else;

    const data = new FormData();
    data.set('company_name', companyName);
    data.set('company_type', companyType);
    data.set('tax_registration', tax);
    data.set('business_insurance', business);
    data.set('construction_licenses', constructionList);
    data.set('availability', availability);
    data.set('introduction', Introduction);
    data.set('skills', skillsList);
    data.set('work_location_state', selectedState);
    data.set('work_location_city', citiesList);
    await postDataWithToken(`${url}/api/professional_detail`, data, token)
      .then((result) => {
        if (result.status === 200) {
          setSucces(true);
          // successRef.current.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            setSucces(false);
          }, 3000);
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const onRemove = (selectedList, removedItem) => {
    let list = [];
    selectedList.map((city) => {
      list.push(city.id);
      list.push(city.city_id);
    });
    list = list.filter((elem) => elem !== undefined);
    let unique = [...new Set(list)];
    setCitiesList(unique);
  };

  const onSelect = (selectedList, selectedItem) => {
    let list = [];
    selectedList.map((value) => {
      list.push(value.id);
      list.push(value.city_id);
    });
    //remove any undefined values from array
    list = list.filter((elem) => elem !== undefined);
    //makes sure we don't have duplicate values
    let unique = [...new Set(list)];
    setCitiesList(unique);
  };

  const onRemoveLicenses = (selectedList, removedItem) => {
    const mapLicenses = selectedList.map((license) => license.id);
    const filter = mapLicenses.filter(
      (license) => license !== removedItem.license_id
    );
    setConstructionList(filter);
  };

  const onSelectLicenses = (selectedList, selectedItem) => {
    const selected = selectedList.map((value) => value.id);
    let list = [];
    list.push(...selected, selectedItem.license_id);
    let unique = [...new Set(list)];
    setConstructionList(unique);
  };

  const onRemoveSkills = (selectedList, removedItem) => {
    const mapSkills = selectedList.map((skill) => skill.id);
    const filter = mapSkills.filter((skill) => skill !== removedItem.skills_id);
    setSkillsList(filter);
  };

  const onSelectSkills = (selectedList, selectedItem) => {
    const selected = selectedList.map((value) => value.id);
    let list = [];
    list.push(...selected, selectedItem.skills_id);
    let unique = [...new Set(list)];
    setSkillsList(unique);
  };

  const handleState = (e) => {
    setSelectedState(e.target.value);
  };

  const successRef = useRef(null);
  console.log(savedSkills);
  return (
    <div className='card'>
      {succes ? (
        <div
          className='alert-success'
          style={{ padding: '1rem' }}
          ref={successRef}
        >
          Successfully Updated!
        </div>
      ) : (
        ''
      )}

      <form onSubmit={handleSubmit}>
        <div className='card-body'>
          <div className='row'>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label>{t('account.companyName')}</label>
                <input
                  type='text'
                  className='form-control'
                  value={companyName}
                  onChange={(e) => {
                    setCompanyName(e.target.value);
                    setErrors({ ...errors, company_error: '' });
                  }}
                />
                <div className='prof-error'>{company_error}</div>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label> {t('account.companyType')}</label>
                <select
                  onChange={(e) => setCompanyType(e.target.value)}
                  value={companyType}
                >
                  <option value='1'>
                    {t('account.professional.soleProprietor')}
                  </option>
                  <option value='2'>{t('account.professional.pvtLtd')}</option>
                  <option value='3'>
                    {t('account.professional.freelancer')}
                  </option>
                </select>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label>{t('account.taxRegistration')} </label>
                <select onChange={(e) => setTax(e.target.value)} value={tax}>
                  <option value='0'>{t('account.professional.no')}</option>
                  <option value='1'>{t('account.professional.yes')}</option>
                </select>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label>{t('account.businessInsurance')}</label>
                <select
                  onChange={(e) => setBusiness(e.target.value)}
                  value={business}
                >
                  <option value='0'>{t('account.professional.no')}</option>
                  <option value='1'>{t('account.professional.yes')}</option>
                </select>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label> {t('account.constructionLicenses')} </label>
                {/* <select
                  value={construction}
                  onChange={(e) => setConstruction(e.target.value)}
                >
                  <option value='1'>Vedeneristys</option>
                  <option value='2'>Sertifikaatti</option>
                  <option value='3'>Työturvallisuuskortti</option>
                  <option value='4'>Tulityökortti</option>
                  <option value='5'>Valttikortti</option>
                  <option value='6'>Muu koulutus/pätevyys</option>
                </select> */}
                <Multiselect
                  options={construction}
                  selectedValues={savedConstruction}
                  displayValue='licenses'
                  onRemove={onRemoveLicenses}
                  onSelect={onSelectLicenses}
                  selectedList={savedConstruction}
                  placeholder={t('account.professional.Select')}
                />
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label> {t('account.myAvailability')} </label>
                <select
                  onChange={(e) => setAvailability(e.target.value)}
                  value={availability}
                >
                  <option value='0'>{t('account.professional.none')}</option>
                  <option value='1'>
                    {t('account.professional.moreThan')}
                  </option>
                  <option value='2'>
                    {t('account.professional.lessThan')}
                  </option>
                  <option value='3'>
                    {t('account.professional.asNeeded')}
                  </option>
                </select>
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label>{t('account.introduction')} </label>
                <textarea
                  className='form-control'
                  onChange={(e) => {
                    setIntroduction(e.target.value);
                    setErrors({ ...errors, intro_error: '' });
                  }}
                  value={Introduction || ''}
                ></textarea>
                {intro_error ? (
                  <div className='prof-error'>{intro_error}</div>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label> {t('account.skillsAndInterests')} </label>
                <Multiselect
                  options={skills}
                  selectedValues={savedSkills}
                  displayValue='skills_identifier'
                  onRemove={onRemoveSkills}
                  onSelect={onSelectSkills}
                  selectedList={savedSkills}
                  placeholder={t('account.professional.Select')}
                />
              </div>
            </div>
            <div className='col-12 col-md-6'>
              <div className='form-group'>
                <label>{t('account.chooseWorkLocation')} </label>
                <div className='prof-work-location'>
                  <div className='prof-multiselect'>
                    <label>{t('account.state')} </label>
                    <select onChange={handleState} value={selectedState}>
                      <option>{t('account.professional.select')}</option>
                      {states &&
                        states.map((state) => {
                          return (
                            <option key={state.state_id} value={state.state_id}>
                              {state.state_name}
                            </option>
                          );
                        })}
                    </select>
                  </div>
                  <div className='prof-multiselect'>
                    <label> {t('account.city')} </label>
                    <Multiselect
                      options={city}
                      selectedValues={savedCities}
                      displayValue='city_identifier'
                      onRemove={onRemove}
                      onSelect={onSelect}
                      emptyRecordMsg={t(
                        'account.professional.No_Options_Available'
                      )}
                      placeholder={t('account.professional.Select')}
                    ></Multiselect>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-12'>
              <button className='btn btn-success' type='submit'>
                {t('account.saveChanges')}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default withTranslation()(Professional);
