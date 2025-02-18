import React from 'react'
import styled from 'styled-components'
/* Alla ikoner sidan använder */
function Credits() {
    return (
        <>
            <CreditContainer>
                <a
                    id="cred"
                    href="https://www.flaticon.com/free-icons/location"
                    title="location icons"
                >
                    Location icons created by Smashicons - Flaticon
                </a>
                <a
                    id="cred"
                    href="https://www.flaticon.com/free-icons/boat"
                    title="boat icons"
                >
                    Boat icons created by Freepik - Flaticon
                </a>
                <a
                    id="cred"
                    href="https://www.flaticon.com/free-icons/swimming"
                    title="swimming icons"
                >
                    Swimming icons created by Smashicons - Flaticon
                </a>
                <a
                    id="cred"
                    href="https://www.flaticon.com/free-icons/restaurant"
                    title="restaurant icons"
                >
                    Restaurant icons created by Freepik - Flaticon
                </a>
            </CreditContainer>
        </>
    )
}

export default Credits

const CreditContainer = styled.section`
    display: flex;
    padding: .5rem;
    a {
        color: #006aa7;
        text-decoration: none;
    }
`
