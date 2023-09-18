import { Chip, DataTable } from "react-native-paper";
import React, { useMemo, useState } from "react";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { format } from "date-fns";
import { Inventory } from "./store/inventory";

interface ProductItemProps {
  record: Inventory;
}

export default function ProductItem({ record }: ProductItemProps) {
  // State to toggle showing more details
  const [showMore, setShowMore] = useState<boolean>(false);

  // Extract categories from the "Product Categories" string
  const categoriesArr = useMemo(() => {
    return (record.fields["Product Categories"] || "").split(",").map(category => category.trim()).filter(category => category);
  }, [record.fields["Product Categories"]]);


  // Check if the date is within the last 7 days
  function checkIfNew(): boolean {
    const ProductionPostedDate = new Date(record.fields["Posted"]);
    const currentDate = new Date();
    const timeDifference = currentDate.getTime() - ProductionPostedDate.getTime();
    return timeDifference <= 7 * 24 * 60 * 60 * 1000;

  }

  // Toggle function to show/hide more details
  function handleShowMore():void {
    setShowMore((prevState) => !prevState);
  }

  // Format date to "dd/MM/yyyy" format
  function formatDate(originalDate) :string{
    return format(new Date(originalDate), "dd/MM/yyyy");
  }

  // Rotation value for the chevron icon
  const rotate:string = showMore ? "180deg" : "0deg";

  return (
    <DataTable.Row
      style={
        Platform.OS === "ios"
          ? [styles.shadowStyle, styles.row]
          : [styles.elevationStyle, styles.row]
      }
    >
      <Image
        source={
          record.fields["Product Image"]
            ? { uri: record.fields["Product Image"] }
            : require("../assets/img-placeholder.png")
        }
        style={styles.image}
      />
      <View style={styles.cellInfo}>
        <View style={styles.cellHeader}>
          <View style={{ flex: 5 }}>
            <Text
              style={
                styles.headerText
              }
              numberOfLines={showMore ? undefined : 1} // Show only one line if not expanded
            >
              {record.fields["Product Name"]}
            </Text>
            <Text style={styles.date}>
              {formatDate(record.fields["Posted"])}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 4, justifyContent: "flex-end" }}>
            {checkIfNew() && <Image
              source={require("../assets/new-icon.png")}
            />}
            <TouchableOpacity onPress={handleShowMore}>
              <Image
                source={require("../assets/chevron-down.png")}
                style={[styles.chevron, { transform: [{ rotate }] }]}
              />
            </TouchableOpacity>
          </View>
        </View>
        {showMore &&
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {categoriesArr.map((category, index) => (
              <Chip key={index} style={styles.chip}>
                <Text style={{ fontSize: 12 }}>{category}</Text>
              </Chip>
            ))}
          </View>}
      </View>
    </DataTable.Row>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#F8F9FC",
    minHeight: 70,
    margin: 10,
    borderRadius: 5
  },
  image: {
    flex: 1,
     objectFit:'contain'
  },

  cellInfo: {
    flex: 2.3,
    flexDirection: "column",
    marginLeft: 12
  },
  cellHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 3
  },
  headerText: {
    flex: 4,
    fontSize: 20,
    fontStyle: "normal",
    fontWeight: "900",
    lineHeight: 22,
    flexWrap: "wrap"
  },
  chevron: {
    width: 24,
    height: 24
  },
  chip: {
    alignItems: "center",
    backgroundColor: "#D4E5FF",
    borderRadius: 16,
    marginRight: 2,
    marginTop: 6
  },
  date: {
    fontSize: 12,
    lineHeight: 16,
    marginVertical: 4
  },
  // for IOS
  shadowStyle: {
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowColor: "rgba(27, 38, 51, 0.25)",
    shadowOpacity: 1,
    shadowRadius: 3
  },
  // for android
  elevationStyle: {
    elevation: 3,
    borderBottomWidth: 2
  }
});
