import { 
    fetchHydra,
    hydraDataProvider,
} from '@api-platform/admin'
import { fetchUtils } from 'react-admin';
import { getAuthToken, deleteAuthToken } from '../../js/util/auth'
import { ApiFetch } from '../../js/util/postUtil'
import { ApiFetchGetOptions} from '../../js/util/getUtil'
import { parseHydraDocumentation } from "@api-platform/api-doc-parser"

const getAuthHeaders = () => {
    // {'X-Authorization': 'Bearer ' + token}
    const token = getAuthToken()
    const headers = new Headers()
    headers.append("X-Authorization", "Bearer " + token)

    // console.log({'src/dataProvider/main/DataProvder': headers.get("X-Authorization")})
  
    return headers;
};

const getHydraWithHeaders = (url, options = {}) =>
{
    console.log({urlSet: url})
    return fetchHydra(url, {
        ...options,
        headers: options.headers ?? getAuthHeaders,
      })
}

const apiDocumentationParser = async () => {
    try {
        // setRedirectToLogin(false)
    
        return await parseHydraDocumentation("/api", {
            headers: getAuthHeaders,
        })
    } catch (result) {
        const { api, response, status } = result;
        if (status !== 401 || !response) {
        throw result;
        }
    
        deleteAuthToken;
    
        // setRedirectToLogin(true)
    
        return {
            api,
            response,
            status,
        }
    }
}

export const dataProvider = ({
    ...hydraDataProvider({
        entrypoint: '/api',
        httpClient: getHydraWithHeaders,
        useEmbedded: true,
        apiDocumentationParser: apiDocumentationParser
    }),
    getOneSubscription: async (resource, params) => {
        const GetUrl = `/api/${resource}/${params}/subscriptions/paid`
        const token = getAuthToken()
        const requestOptions = ApiFetchGetOptions(GetUrl, {'X-Authorization': 'Bearer ' + token})
        const request = ApiFetch(requestOptions)
        
        try {      
            const response = await request
            const getResults = await response.json()
      
            console.log({reponse_api_dashboard: getResults})
      
            if(!response.ok && response.status === 401){ // 401
              throw {response: { message: getResults.message, code: response.status }}
            }
      
            return getResults
          
          } catch (error) {
      
            // ? handle user doesnt has subscription yet
            console.log({ error_request_userdata: error })
        }  
    }
})
