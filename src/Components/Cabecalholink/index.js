import { Link } from "react-router-dom";
import Styles from './cabecalholink.module.css';

function cabecalholink({URL,children}) {
  return (
   <Link to={URL} className= {Styles.link}>
    {children}
   </Link>  
  )
}   export default cabecalholink;