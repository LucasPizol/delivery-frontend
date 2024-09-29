import { useAuth } from "@/hooks/useAuth";
import { ProductModel } from "@/interfaces/Product";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

interface MenuPDFProps {
  products: ProductModel[];
}

export const MenuPDF = ({ products }: MenuPDFProps) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
            Cardápio Digital
          </Text>
        </View>

        <View style={styles.line}></View>

        <View
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          {products.map((product) => (
            <View style={styles.item} key={product.id}>
              {product.image && (
                <Image
                  src={{
                    uri: product.image + `?noCache=${new Date().getTime()}`,
                    method: "GET",
                    headers: {
                      "Access-Control-Allow-Origin": "*",
                    },
                    body: "",
                  }}
                  style={{
                    borderRadius: 0,
                    objectFit: "cover",
                    backgroundColor: "#fff",
                    aspectRatio: 1,
                    height: "100%",
                  }}
                />
              )}

              <View
                style={{
                  justifyContent: "space-between",
                  height: "100%",
                  flex: 1,
                  padding: 8,
                }}
              >
                <View>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: "bold",
                    }}
                  >
                    {product.name}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                    }}
                  >
                    {product.description}
                  </Text>
                </View>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    textAlign: "right",
                  }}
                >
                  {product.price.toLocaleString("pt-br", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#0e0808",
    padding: 28,
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
  item: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    border: "1px solid #fff",
    color: "#fff",
    height: 70,
    width: "47%",
    borderRadius: 8,
    gap: 8,
    overflow: "hidden",
  },

  line: {
    width: "100%",
    height: 2,
    backgroundColor: "#fff",
    marginBottom: 10,
    marginTop: 4,
  },
});
