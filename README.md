# recipes
Find the most relevant recipes that you can prepare with the ingredients that you have at home

## Data
The data is scraped from www.allrecipes.com with [recipe-scrapers](https://github.com/hhursev/recipe-scrapers)

## Running instructions:

1- Install java (open-jdk) version 21 or higher and have pointed the JAVA_HOME environment variable to the jdk installation path (debian-based distros: /usr/lib/jvm/java-21-openjdk-amd64) and maven v3.6.3 or higher.

2- Git checkout the code from the branch feature_branch (or from main when the pull requests are accepted).

3- Have a MySQL server 8+ installed and running on port 3306 (which is the default one) with an empty DB named recipe_db and the following user created:

    username: danipereza

    password: letscook

4- Run mvn spring-boot:run from the project's root folder (note: the data is loaded into the DB on the first run of the application, it can take several minutes. Subsequent runs will skip this loading).

5- Once the data is loaded, run manually the following SQL: 
```sql textWrap
ALTER TABLE ingredient ADD FULLTEXT INDEX ft_name (name);
```
6- Stop the application server and run it again

7- Access http://localhost:8080.

NOTE: steps 1, 2, 3, 5 and 6 only have to be done once. After that, only steps 4 and 7 are needed).
