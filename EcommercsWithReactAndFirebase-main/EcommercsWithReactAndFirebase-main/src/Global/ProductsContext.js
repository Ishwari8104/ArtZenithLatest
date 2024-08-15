import React, { createContext } from 'react'
import { fs } from '../Config/Config'

export const ProductsContext = createContext();

export class ProductsContextProvider extends React.Component {

    state = {
        products: []
    }

    componentDidMount() {

        const prevProducts = this.state.products;
        fs.collection('Products').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if (change.type === 'added') {
                    prevProducts.push({
                        ProductID: change.doc.id,
                        ProductName: change.doc.data().title,
                        ProductPrice: change.doc.data().price,
                        ProductImg: change.doc.data().url,
                        ArtistName: change.doc.data().artistName,
                        Canvas: change.doc.data().canvas,
                        CreatedIn: change.doc.data().createdIn,
                        Description: change.doc.data().description,
                        Size: change.doc.data().size,
                        Style: change.doc.data().style
                    })
                }
                this.setState({
                    products: prevProducts
                })
            })
        })

    }
    render() {
        return (
            <ProductsContext.Provider value={{ products: [...this.state.products] }}>
                {this.props.children}
            </ProductsContext.Provider>
        )
    }
}

