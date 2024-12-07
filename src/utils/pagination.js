function getPagination(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;  // determina quantos itens pular
  const take = parseInt(pageSize);     // quantos itens pegar na consulta

  return { skip, take };
}

module.exports = { getPagination };
