import React from 'react'
import { graphql, Link } from 'gatsby'
import Image from 'gatsby-image'
import { ChevronLeft } from 'react-feather'

import PageHeader from '../components/PageHeader'
import Layout from '../components/Layout'
import ProductForm from '../components/ProductForm'

import './ProductPage.css'

const ProductPage = ({ data }) => {
    const product = data.shopifyProduct
    const thisEdge = data.allServices.edges.find(edge => edge.node.id === product.id);

    return (
        <Layout title={product.title || false}>
            <article
                className="SingleService section light"
                itemScope
                itemType="http://schema.org/BlogPosting"
            >
                <div className="container skinny">
                    <Link className="SingleService--BackButton" to="/services/">
                        <ChevronLeft /> BACK
                    </Link>
                    <div className="SingleService--Content relative">
                        {product.title && (
                            <h1 className="SingleService--Title" itemProp="title">
                                {product.title}
                            </h1>
                        )}

                        {product.images.map(image => (
                            <Image
                                fluid={image.localFile.childImageSharp.fluid}
                                key={image.id}
                                alt={product.title}
                            />
                        ))}

                        <div className="SingleService--InnerContent">
                            <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
                            <ProductForm product={product} />
                        </div>

                        <div className="SingleService--Pagination">
                            {thisEdge && thisEdge.previous && thisEdge.previous.handle && (
                                <Link
                                    className="SingleService--Pagination--Link prev"
                                    to={`/service/${thisEdge.previous.handle}`}
                                >
                                    Previous Service
                                </Link>
                            )}
                            {thisEdge && thisEdge.next && thisEdge.next.handle && (
                                <Link
                                    className="SingleService--Pagination--Link next"
                                    to={`/service/${thisEdge.next.handle}`}
                                >
                                    Next Service
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </article>
        </Layout >
    )
}

export default ProductPage

export const pageQuery = graphql`
  query($handle: String!) {
    shopifyProduct(handle: { eq: $handle }) {
      id
      title
      handle
      productType
      description
      descriptionHtml
      shopifyId
      options {
        id
        name
        values
      }
      variants {
        id
        title
        price
        availableForSale
        compareAtPrice
        shopifyId
        selectedOptions {
          name
          value
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images {
        originalSrc
        id
        localFile {
          childImageSharp {
            fluid(maxWidth: 910) {
              ...GatsbyImageSharpFluid_withWebp_tracedSVG
            }
          }
        }
      }
    }

    allServices: allShopifyProduct(sort: {fields: publishedAt, order: DESC}) {
      edges {
        node {
          id
        }
        next {
          title
          handle
        }
        previous {
          title
          handle
        }
      }
    }
  
  }
`