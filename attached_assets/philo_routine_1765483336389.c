/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   philo_routine.c                                    :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: malmarzo <malmarzo@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/11/23 09:15:37 by malmarzo          #+#    #+#             */
/*   Updated: 2025/11/23 11:55:37 by malmarzo         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../include/philo.h"

void	eat_routine(t_philo *philo)
{
	pthread_mutex_lock(philo->left_fork);
	print_status(philo, "has taken a fork");
	if (philo->data->num_philos == 1)
	{
		ft_usleep(philo->data->time_to_die, philo->data);
		pthread_mutex_unlock(philo->left_fork);
		return ;
	}
	pthread_mutex_lock(philo->right_fork);
	print_status(philo, "has taken a fork");
	pthread_mutex_lock(&philo->data->meal_lock);
	philo->last_meal_time = get_time();
	pthread_mutex_unlock(&philo->data->meal_lock);
	print_status(philo, "is eating");
	ft_usleep(philo->data->time_to_eat, philo->data);
	pthread_mutex_lock(&philo->data->meal_lock);
	philo->eat_count++;
	pthread_mutex_unlock(&philo->data->meal_lock);
	pthread_mutex_unlock(philo->right_fork);
	pthread_mutex_unlock(philo->left_fork);
}

void	think_routine(t_philo *philo)
{
	long long	think_time;
	long long	time_since_meal;

	print_status(philo, "is thinking");
	pthread_mutex_lock(&philo->data->meal_lock);
	time_since_meal = get_time() - philo->last_meal_time;
	pthread_mutex_unlock(&philo->data->meal_lock);
	think_time = (philo->data->time_to_die - time_since_meal
			- philo->data->time_to_eat) / 2;
	if (think_time < 0)
		think_time = 0;
	if (think_time > 200)
		think_time = 200;
	if (think_time > 0)
		ft_usleep(think_time, philo->data);
}

void	*philo_routine(void *arg)
{
	t_philo	*philo;

	philo = (t_philo *)arg;
	wait_for_start(philo->data);
	if (philo->id % 2 == 0)
		ft_usleep(1, philo->data);
	while (!is_dead(philo->data))
	{
		eat_routine(philo);
		if (philo->data->num_philos == 1)
			break ;
		if (is_dead(philo->data))
			break ;
		print_status(philo, "is sleeping");
		ft_usleep(philo->data->time_to_sleep, philo->data);
		if (is_dead(philo->data))
			break ;
		think_routine(philo);
	}
	return (NULL);
}
