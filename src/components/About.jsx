import styled from 'styled-components'

function About() {
    return (
        <>
            <AboutContainer>
                <h2>Om SwedishMarkers</h2>
                <p>
                    På denna sida kan du enkelt hitta intressanta och unika
                    platser runtom i Sverige
                </p>
                <p>Du kan dessutom lägga till nya platser om du är inloggad</p>
                <h3>
                    Skapad av{' '}
                    <a
                        href="https://www.strandvide.se"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Joacim Strandvide
                    </a>
                </h3>
            </AboutContainer>
        </>
    )
}

export default About

const AboutContainer = styled.section`
    text-align: center;

    h2 {
        font-family: 'Oswald', sans-serif;
        margin-bottom: 4rem;
    }

    h3 {
        font-family: 'Oswald', sans-serif;
        margin-top: 3rem;
    }

    p {
        font-family: Arial, Helvetica, sans-serif;
    }

    a {
        color: #006aa7;
        text-decoration: none;
    }
`
