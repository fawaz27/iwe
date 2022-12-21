
describe('Essai',()=>{
    it('test',async ()=>{
        const repositoryMock = {
            createQueryBuilder: jest.fn(),
          };
          
          // Définissez ce que la méthode createQueryBuilder doit retourner
          repositoryMock.createQueryBuilder.mockImplementation(() => ({
            leftJoinAndSelect: jest.fn(() => ({
              leftJoinAndSelect: jest.fn(() => ({
                andWhere: jest.fn(() => ({
                  getMany: jest.fn(() => ['data1', 'data2']),
                })),
              })),
            })),
          }));
          
          // Appelez la requête de base de données et vérifiez que le résultat attendu est retourné
          const estabs = await repositoryMock.createQueryBuilder("etablishment")
            .leftJoinAndSelect("etablishment.year","year")
            .leftJoinAndSelect("etablishment.teacher_ets","teacher_ets")
            .andWhere("teacher_ets.role = :role",{role:"director"})
            .getMany();
          expect(estabs).toEqual(['data1', 'data2']);
          
          
          
    })
    
});


