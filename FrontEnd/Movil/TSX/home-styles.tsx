import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff"
	},
	center: {
		alignItems: "center"
	},
	image: {
		width: 50,
		height: 50,
		marginVertical: 10
	},
	image_navbar: {
		width: 20,
		height: 20
	},
	subContainerDateTime: {
		display: "flex",
		flexDirection: "row",
		paddingHorizontal: 15,
		paddingVertical: 5
	},
	subContainerDT1: {
		width: "40%",
		justifyContent: "center",
		paddingTop: 5
	},
	subContainerDT2: {
		width: "60%",
	},
	navbar: {
		height: 60,
		backgroundColor: '#fff', 
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 15,
		gap: 20,
		marginTop: Platform.OS === "web" ? 0 : 50
	},
	title: {
		color: '#353535',
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: "center",
		marginVertical: 10
	},
	subtitle: {
		justifyContent: "center",
		marginVertical: 10,
		width: "95%"
	},
	subtitleGraph: {
		marginVertical: 30
	},
	centerButtons: {
		flexDirection: 'row',
		flex: 1,
		justifyContent: 'center'
	},
	navButton: {
		marginHorizontal: Platform.OS === 'web' ? 10 : 15,
		paddingVertical: 8,
		paddingHorizontal: 15,
		backgroundColor: '#fff',
		borderRadius: 5,
		alignItems: "center",
	},
	rightButton: {
		paddingVertical: 8,
		paddingHorizontal: 15,
		borderRadius: 5,
		marginHorizontal: Platform.OS === 'web' ? 0 : 15,
		alignItems: "center"
	},
	buttonText: {
		color: '#353535',
		fontWeight: 'bold'
	},
	content: {
		flex: 1,
		backgroundColor: '#fff',
		paddingLeft: Platform.OS === 'web' ? 0 : 30,
		alignItems: Platform.OS === 'web' ? "center" : "baseline",
		justifyContent: "center"
	},
	containers: {
		width: Platform.OS === 'web' ? "25%" : "100%",
		paddingVertical: 20
	},
	containersSub: {
		borderRadius: 5,
		borderWidth: 2,
		borderColor: '#e3e3e3',
		width: "92%",
		marginVertical: Platform.OS === "web" ? 0 : 20
	},
	selectedText: {
	  fontSize: 16,
	  marginBottom: 10,
	},
	listItem: {
		padding: 15,
		borderBottomWidth: 1,
		borderColor: '#ddd'
	},
	listTitle: {
		fontSize: 18,
		fontWeight: 'bold'
	},
	listSubtitle: {
		fontSize: 14,
		color: '#666'
	},
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.2)'
	},
	modalContent: {
		width: 300,
		padding: 20,
		backgroundColor: '#fff',
		borderRadius: 10
	},
	picker: {
		height: 50,
		width: "auto"
	},
	networkItem: {
	  fontSize: 16,
	  paddingVertical: 5,
	},
	closeButton: {
	  padding: 10,
	  marginTop: 10, 
	  borderRadius: 8,
	  borderWidth: 2,
	  borderColor: '#ff7e7e',
	},
	input: {
		height: 40
	},
	flex: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between"
	},
	resetButton: {
		backgroundColor: "#000",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
		alignSelf: "flex-end",
		display: "flex",
		position: "absolute",
		top: "50%",
		right: "5%"
	},
	resetButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	image_top: {
		height: "20%"
	},
	bg_graph: {
		borderRadius: 10,
	},
	bg_graph_container: {
		position: "absolute",
		bottom: "-12%",
	},
	messageText: {
	  fontSize: 16,
	  color: '#444',
	  marginBottom: 15,
	  textAlign: 'center'
	},
	smallText: {
	  fontSize: 12,
	  color: '#666',
	  marginTop: 10,
	  textAlign: 'center'
	},
	errorText: {
	  fontSize: 14,
	  color: 'red',
	  textAlign: 'center'
	},
	chart: {
	  marginVertical: 8,
	  borderRadius: 10,
	  alignSelf: 'center',
	  marginLeft: -10    //* Editar
	},
	errorGraphText: {
	  fontSize: 16,
	  color: '#000',
	  marginBottom: 10,
	  textAlign: 'center'
	}
});