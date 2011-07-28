<?php
/*
 * This file is part of the Axgen Bundle.
 *
 * (c) Alejandro Hurtado <ahurt2000@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace Acme\AxGenBundle\AxGenerator;

use Symfony\Bundle\DoctrineBundle\Mapping\DisconnectedMetadataFactory;

use Doctrine\ORM\Tools\EntityRepositoryGenerator;
use Doctrine\ORM\Tools\EntityGenerator;
use Acme\AxGenBundle\AxGenerator\AxUtils;

/**
 * Generate Entities 
 * 
 * @author: Alejandro Hurtado <ahurt2000@gmail.com>
 */
class AxDoctrineEntitiesGeneratorCall
{
    public function execute($request,$kernel,$doctrine)
    {
        $bundleName = $request->request->get('name');
        $backup = $request->request->get('backup')== "false"? false:true;
        $path  = $request->request->get('path');
        
        $output = array();
        $errors = array();
     
        $manager = new DisconnectedMetadataFactory($doctrine);
        
        /*  algunos  no estoy seguro que se capturen ej: */
        try {
            $bundle = $kernel->getBundle($bundleName);
            $metadata = $manager->getBundleMetadata($bundle);
            $output[] = sprintf('Generating entities for bundle "<info>%s</info>"', $bundle->getName());
        } catch (\InvalidArgumentException $e) {
            $name = strtr($bundleName, '/', '\\');
            if (false !== $pos = strpos($name, ':')) {
                $name = $doctrine->getEntityNamespace(substr($name, 0, $pos)).'\\'.substr($name, $pos + 1);
            }
            if (class_exists($name)) {
                $output[] = sprintf('Generating entity "<b>%s</b>"', $name);
                $metadata = $manager->getClassMetadata($name, $path );
            } else {
                $output[] = sprintf('Generating entities for namespace "<info>%s</info>"', $name);
                $metadata = $manager->getNamespaceMetadata($name, $path);
            }
        }catch(\RuntimeException $e){
            $errors[]=$e->getMessage();
        }
        
        
        $generator = $this->getEntityGenerator();
        $generator->setBackupExisting($backup);
        $repoGenerator = new EntityRepositoryGenerator();
        foreach ($metadata->getMetadata() as $m) {
            $output[]  = sprintf('  > generating <b>%s</b>', $m->name);
            $generator->setAnnotationPrefix('ORM\\');
            // this check not exist in the Sensio generator 
            try { 
                $generator->generate(array($m), $metadata->getPath());
            }catch(\RuntimeException $e){
                $errors[]=$e->getMessage();
            }
            if ($m->customRepositoryClassName && false !== strpos($m->customRepositoryClassName, $metadata->getNamespace())) {
                $repoGenerator->writeEntityRepositoryClass($m->customRepositoryClassName, $metadata->getPath());
            }
        }
        
        //return any errors 
        $chck = AxUtils::onError($errors);
        if($chck !==false){
            return $chck;
        }     
        
        return AxUtils::onSuccess($output);
    }
    
    protected function getEntityGenerator()
    {
        $entityGenerator = new EntityGenerator();
        $entityGenerator->setGenerateAnnotations(false);
        $entityGenerator->setGenerateStubMethods(true);
        $entityGenerator->setRegenerateEntityIfExists(false);
        $entityGenerator->setUpdateEntityIfExists(true);
        $entityGenerator->setNumSpaces(4);

        return $entityGenerator;
    }
}