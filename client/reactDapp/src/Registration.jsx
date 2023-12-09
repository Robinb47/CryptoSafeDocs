import { useState } from 'react';
import CryptoJS from 'crypto-js';
import {ethers} from 'ethers'
import RSAPublicKeyRegistration_abi from '.contracts/RSAPublicKeyRegistration';

/**
 * Nach Login Möglichkeit für Upload Download oder KeyGenerator 
 * bei Auswahl von Keygenerator öffnet sich dieser
 * Login mit CryptoAdresse überprüfung ob es der passende ist
 */


