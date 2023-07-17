import {gql} from "@apollo/client";

const GET_MESSAGES = gql`
    query getMessage {
        messages{
            id
            content
        }
    }
`

//for single project
const GET_MESSAGE = gql`
    query getMessage($id: ID!){
        messages(id: $id){
            name
            messages{
                content
            }
            recipient{
                id
            }
        }
    }
`

export {GET_MESSAGES, GET_MESSAGE}