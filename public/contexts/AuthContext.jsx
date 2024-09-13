// This page is the context provider for the authentication context. It provides the context to all the components that are wrapped in the AuthProvider component.

import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
