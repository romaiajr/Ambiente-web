import departamentoService from "../../services/departamentoService";
import headers from "../../utils/headers.json";
export default {
  structure :async () => {
    try {
      departamentoService.get().then((response) => {
        let data = response.data.sort((a, b) => {
          return a.abbreviation.localeCompare(b.abbreviation);
        });
        return {data: data, headers: headers.departamento}
      });
    } catch (error) {
      console.log(error);
    }
  },

  filter : (list, searchQuery) => {
    let search = removeSpecial(searchQuery.toLowerCase().trim());
    if (search != "") {
      return list.filter((item) => {
        return (
          removeSpecial(item.name.toLowerCase()).includes(search) ||
          removeSpecial(item.abbreviation.toLowerCase()).includes(search)
        );
      });
    } else {
      return list;
    }
  }
}

function removeSpecial(texto) {
  texto = texto.replace(/[ÀÁÂÃÄÅ]/, "A");
  texto = texto.replace(/[àáâãäå]/, "a");
  texto = texto.replace(/[ÈÉÊË]/, "E");
  texto = texto.replace(/[Ç]/, "C");
  texto = texto.replace(/[ç]/, "c");
  return texto;
}