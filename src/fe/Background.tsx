import styled from "styled-components";

/*
  A fixed background with semi-black transparency
  Using this method because {
    background-attachment: fixed;
  } is not supported on mobile
  https://stackoverflow.com/a/23420490
*/

const Fixed = styled.div`
  z-index: -1;
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;
const Top = styled(Fixed)`
  background-color: rgba(0, 0, 0, 0.8);
`;
const Bottom = styled(Fixed)`
  background-color: black;
  background-image: url('images/splash.jpg');
  background-size: cover;
  background-position: center;
`;

export function Background() {
  return (
    <>
      <Bottom></Bottom>
      <Top></Top>
    </>
  )

}
