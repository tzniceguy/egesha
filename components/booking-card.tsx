import colors from "@/lib/styles/colors";
import { View, Text, StyleSheet, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
  title: string;
  date: string;
  price: string;
}

const BookingCard = ({ title, date, price }: Props) => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{date}</Text>
        <Text style={styles.description}>{price}</Text>
        <TouchableOpacity style={styles.button}>
          <Text>view details</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text>Image illustration</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 10,
    flexDirection: "row",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
  },
  button: {
    borderColor: colors.primary,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginLeft: 10,
  },
});

export default BookingCard;
