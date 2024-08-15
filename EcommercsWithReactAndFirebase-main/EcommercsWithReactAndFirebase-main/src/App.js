import React, { useState, useEffect } from 'react';
import { ProductsContextProvider } from './Global/ProductsContext';
import { Home } from './Components/Home';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Signup } from './Components/Signup';
import { Login } from './Components/Login';
import { NotFound } from './Components/NotFound';
import { auth, fs } from './Config/Config';
import { CartContextProvider } from './Global/CartContext';
import { Cart } from './Components/Cart';
import { AddProducts } from './Components/AddProducts';
import { Cashout } from './Components/Cashout';
import { ProductDetails } from './Components/ProductDetails';
import { AddArtist } from './Components/AddArtist';
import { ArtistContextProvider } from './Global/ArtistContext';
import { Artist } from './Components/Artist';
import { MostLikedArt } from './Components/MostLikedArt';
import { LikesContextProvider } from './Global/LikesContext'; // Import LikesContextProvider

function App() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fs.collection('SignedUpUsersData')
                    .doc(user.uid)
                    .get()
                    .then((snapshot) => {
                        const userData = snapshot.data();
                        if (userData && userData.Name) {
                            setUser(userData.Name);
                        } else {
                            setUser(null);
                        }
                    });
            } else {
                setUser(null);
            }
        });
    
        return () => unsubscribe();
    }, []);
    

    return (
        <LikesContextProvider>
        <ProductsContextProvider>
            <ArtistContextProvider>
            <CartContextProvider>
                <BrowserRouter>
                
                    <Switch>
                        {/* home */}
                        <Route exact path='/' component={() => <Home user={user} />} />
                        {/* signup */}
                        <Route path='/signup' component={Signup} />
                        {/* login */}
                        <Route path='/login' component={Login} />
                        {/* cart products */}
                        <Route path='/cartproducts' component={() => <Cart user={user} />} />
                        {/* add products */}
                        <Route path='/addproducts' component={AddProducts} />
                        <Route exact path='/addartist' component={AddArtist} />
                        {/* cashout */}
                        <Route path='/cashout' component={() => <Cashout user={user} />} />
                        <Route path='/product/:id' component={ProductDetails} />
                        <Route path='/artist/:artistName' component={Artist} />
                        <Route path='/mostlikedart' component={() => <MostLikedArt user={user} />} /> 

                        <Route component={NotFound} />
                       

                    </Switch>
                </BrowserRouter>
            </CartContextProvider>
            </ArtistContextProvider>
        </ProductsContextProvider>
        </LikesContextProvider>
    );
}

export default App;
