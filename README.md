AxGenerator Bundle
==================

This bundle is just a easy interface for for the Symfony2 command line generators.
As the bundle developers use it only uses the fictional **Acme** vendor. 

AxGen uses the bundle "Sensio Generator" for their actions. 
The bundle uses the Extjs 2.2 lib for the visual interface.

*This package is only an experiment, as it requires the apache user has write permissions in "src", "app/AppKernel.php" and "app/config/routing.yml" *


Install
-------

- Download and unzip. 
- Edit app/AppKernel.php and add this: 
    
    + ``` $bundles[] = new Acme\AxGenBundle\AcmeAxGenBundle();  ```
       ( for *dev* enviroment only **recommended** )

- Add a route:
    
    Edit file app/config/routing.yml andd add:

```
        AcmeAxGenBundle:
            resource: "@AcmeAxGenBundle/Resources/config/routing.yml"
            prefix:   /
```

- Publish assets

    ``` ./app/console assets:install --symlink web ```
    (the --symlink option not apply in windows systems)

- Point your browser to this url:
    
    http://yourdomain/app_dev.php/axgen

Using
-----

The application show you a menu for easy access to the differents options:

- New bundle: Show a windows for easy call the bundle generator. 
    
  ![New bundle screenshot](http://i51.tinypic.com/v8ctu9.png)

- New entity: Doctrine entity generator 

  ![New entity screenshot](http://i53.tinypic.com/2zyfou8.png)

- Entities: Update all entities 

  ![Generate/update entities](http://i55.tinypic.com/e7ch1f.png)

- CRUD: generate CRUD 

  ![Generate CRUD](http://i51.tinypic.com/25h05dy.png)
