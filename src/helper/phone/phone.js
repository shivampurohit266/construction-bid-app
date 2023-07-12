import React, { Component } from 'react';
import PhoneInput from 'react-phone-input-2';
class Phone extends Component {
  state = {
    country_code: '',
    phone: '',
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.country !== this.props.country) {
      this.selectCountry(this.props.country);
    }
    if (prevProps.phone !== this.props.phone) {
      this.setState({
        phone: this.props.phone,
      });
    }
  }
  selectCountry = (id) => {
    if (id === 72) {
      this.setState({
        country_code: 'fi',
      });
    } else if (id === 67) {
      this.setState({
        country_code: 'ee',
      });
    } else if (id === 195) {
      this.setState({
        country_code: 'es',
      });
    }
  };

  render() {
    const { onChange } = this.props;

    return (
      <div>
        <PhoneInput
          // containerClass="custom_sign"
          name='phone'
          searchClass='custon_sign'
          country={this.state.country_code}
          //enableAreaCodes={true}
          onlyCountries={['fi', 'es', 'ee']}
          //countryCodeEditable={false}
          onChange={onChange}
          value={console.log(this.state.phone)}
        />
      </div>
    );
  }
}

export default Phone;
