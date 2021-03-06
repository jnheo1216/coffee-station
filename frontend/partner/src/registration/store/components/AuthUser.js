import React, {useState, useRef} from 'react';
import {Modal, TouchableOpacity} from 'react-native';
import Postcode from '@actbase/react-daum-postcode';
import styled from 'styled-components/native';
import axios from 'axios';
import Geocoder from 'react-native-geocoding';

const baseURL = 'http://3.38.99.110:8080/api/partner';

const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 10px;
  width: 100%;

  /* border: 1px;
  border-color: red; */
`
const Col1 = styled.View`
  flex-direction: column;
  background-color: white;
  padding: 10px;
  margin: 10px;

  /* border: 1px;
  border-color: orange; */
`

const Container = styled.View`
  justify-content: center;
  /* align-items: center; */
`;
const StyledInput = styled.TextInput`
  border: 1px solid #111111;
  padding: 10px;
  margin: 10px 10px;
  width: 200px;
  font-size: 24px;
`;

const StyledText = styled.Text`
  text-align: ${props => props.btn ? "center" : "left"};
  padding: 10px;
  font-size: ${props => props.btn ? "20px" : "24px"};
  font-family: ${props => props.btn ?"InfinitySansR" : "InfinitySans-Bold"};
  color: ${props => props.btn ? "white" : "black"};
  /* margin: 10px 0; */
`;

const StBtnView = styled.TouchableOpacity`
  /* justify-content: center; */
  width: ${props => props.next ? "95%" : "10%"};
  height: ${props => props.next ? "8%" : "70%"};
  border-radius: 10px;
  background-color: #FF7F00;
`

const StyledBtn = styled.Button`
  font-size: 18px;
  margin: 10px 0;
`;

// custom
const RegisterBtn = styled(StyledBtn)`
  border-width: 0;
  color: #ffffff;
`;
const AddressInput = styled(StyledInput)`
  width: 500px;
`;

const AuthUser = ({navigation}) => {
  // Store state
  const [b_no, setb_no] = useState('');
  const [shopName, setShopName] = useState('');

  // Address state
  const [zoncode, setZoncode] = useState('');
  const [address, setAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // Store useRef
  const refb_no = useRef(null);
  const refShopName = useRef(null);

  // KAKAO POSTCODE
  const [isModal, setModal] = useState(false);

  // ?????? ???????????? ???????????? ?????? boolean
  const [isValidated, setIsValidated] = useState(false);

  // ????????? ?????? ?????? ??????
  const validateBuis = async data => {
    console.log('validation progressing...');
    console.log(data);
    try {
      const response = await axios.post(baseURL + '/validation', data);
      setIsValidated(true);
      alert('????????? ????????? ??????????????????.');
      console.log(response.data);
    } catch (error) {
      // ?????? true??? ??????????????? ????????? ?????? ?????? ???????????? ????????????
      setIsValidated(false);
      console.log(error);
      alert('????????? ????????? ??????????????????.');
    }
  };

  // X, Y ??????
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  // Geocoder
  Geocoder.init('AIzaSyBsxnrrFBrc23fegjtAYgkjr-PtQhXHKEs', {language: 'ko'});
  const setXY = data => {
    Geocoder.from(data)
      .then(json => {
        var location = json.results[0].geometry.location;
        console.log(location);
        setX(location.lng);
        setY(location.lat);
      })
      .catch(error => console.warn(error));
  };
  return (
    <Container>
      <Col1>
        <StyledText>????????? ????????????</StyledText>
        <Row>
            <StyledInput
              value={b_no}
              onChangeText={setb_no}
              ref={refb_no}
              returnKeyType="next"
              onSubmitEditing={() => refShopName.current.focus()}
            />
            <StBtnView onPress={() => validateBuis({b_no})}>
              <StyledText btn>????????? ??????</StyledText>
            </StBtnView>
        </Row>
      </Col1>

      <Col1>
        <StyledText>??????</StyledText>
        <StyledInput
          value={shopName}
          onChangeText={setShopName}
          ref={refShopName}
          returnKeyType="done"
        />
      </Col1>

      <Col1>
        <StyledText>????????? ?????????</StyledText>
        <TouchableOpacity
          style={{width: '18%'}}
          onPressIn={() => setModal(true)}>
          <StyledInput placeholder="????????????" value={zoncode} editable={false} />
        </TouchableOpacity>
          <Modal visible={isModal}>
            <Postcode
              style={{flex: 1}}
              jsOptions={{
                animation: true,
                animationType: 'slide',
                hideMapBtn: true,
              }}
              onSelected={data => {
                // ????????? setData??? ???????????? ??? ???
                setZoncode(data.zonecode);
                setAddress(data.address);
                // alert(JSON.stringify(data));
                setXY(data.address);
                setModal(false);
              }}
            />
          </Modal>
          <AddressInput placeholder="??????" value={address} editable={false} />
        <AddressInput
          placeholder="????????????"
          value={detailAddress}
          onChangeText={setDetailAddress}
        />
      </Col1>
      <StBtnView next style={{marginLeft: "2.5%"}}
        onPress={() =>
          isValidated
            ? shopName != ''
              ? address != ''
                ? detailAddress != ''
                  ? navigation.navigate('RegiStore', {
                      b_no: b_no,
                      shopName: shopName,
                      generalAddress: {
                        address: address,
                        detailAddress: detailAddress,
                        zoncode: zoncode,
                      },
                      x: x,
                      y: y,
                    })
                  : alert('?????? ????????? ????????? ?????????.')
                : alert('????????? ??? ????????? ????????????.')
              : alert('????????? ??? ????????? ????????????')
            : alert('????????? ????????? ??????????????????.')
        }>
        <StyledText btn> ?????? </StyledText>
      </StBtnView>

      
      {/* <RegisterBtn
        // 1. ????????? ????????????
        // 2. ??????
        // 3. ????????? ?????????(????????????, ??????, ????????????)
        // 4. x,y ??????
        title="??????"></RegisterBtn> */}
    </Container>
  );
};

export default AuthUser;
